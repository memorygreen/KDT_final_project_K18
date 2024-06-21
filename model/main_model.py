from quart import Blueprint, jsonify, request
import torch
import asyncio
import os
from datetime import datetime
from model import run_model  # 'run_model'를 model.py에서 가져옴
from db import db_con

main_model_bp = Blueprint('main_model', __name__)

@main_model_bp.route('/model', methods=['POST'])
async def missing_selset():
    db = db_con()
    cursor = db.cursor()

    try:
        # TB_MISSING 테이블에서 가장 최근 레코드 가져오기
        sql_missing = """
        SELECT 
            A.MISSING_IDX, 
            A.USER_ID, 
            A.MISSING_GENDER, 
            A.MISSING_AGE_CATE, 
            A.MISSING_IMG,
            A.MISSING_LOCATION_LAT,
            A.MISSING_LOCATION_LON,
            A.MISSING_LOCATION,
            B.MISSING_TOP,
            B.MISSING_TOP_COLOR,
            B.MISSING_BOTTOMS,
            B.MISSING_BOTTOMS_COLOR,
            A.NEAREST_CCTVS
        FROM 
            TB_MISSING A
        INNER JOIN 
            TB_MISSING_CLOTHES B ON A.MISSING_IDX = B.MISSING_IDX
        ORDER BY A.MISSING_IDX DESC
        LIMIT 1
        """
        cursor.execute(sql_missing)
        missing = cursor.fetchone()

        if not missing:
            return jsonify({"status": "error", "message": "No data found."}), 404

        print("DB Missing Record:", missing)

        # BELONGINGS_CATE 값 가져오기
        sql_belongings = """
        SELECT BELONGINGS_CATE 
        FROM TB_BELONGINGS 
        WHERE MISSING_IDX = %s
        """
        cursor.execute(sql_belongings, (missing[0],))
        belongings = cursor.fetchall()
        belongings_cate = [b[0] for b in belongings if b[0] != 'acc_none']

        print("DB Belongings:", belongings)

        user_conditions = {
            'top color': missing[9],
            'bottom color': missing[11]
        }

        # 만약 belongings_cate가 비어 있지 않으면 bags 조건 추가
        if belongings_cate:
            user_conditions['bags'] = belongings_cate

        print("User Conditions:", user_conditions)

        # NEAREST_CCTVS 컬럼에서 CCTV_IDX 값 추출
        cctv_idxs = missing[12].split(',')

        # CCTV_IDX 값들로부터 CCTV_PATH 가져오기
        format_strings = ','.join(['%s'] * len(cctv_idxs))
        sql_cctv_paths = f"SELECT CCTV_PATH, CCTV_IDX FROM TB_CCTV WHERE CCTV_IDX IN ({format_strings})"
        cursor.execute(sql_cctv_paths, tuple(cctv_idxs))
        cctv_paths = cursor.fetchall()

        print("CCTV Paths:", cctv_paths)

        video_paths = [path[0] for path in cctv_paths]
        cctv_idxs = [path[1] for path in cctv_paths]

        # 모델 실행 (비동기 함수로 호출)
        result = await run_model(user_conditions, video_paths, cctv_idxs, missing[0])

        # 모델 결과를 데이터베이스에 저장
        for missing_id, cctv_idx, s3_url in result['results']:
            print(f"Saving to DB: MISSING_IDX={missing_id}, CCTV_IDX={cctv_idx}, S3_URL={s3_url}")
            sql_insert = """
            INSERT INTO TB_CAPTURE (MISSING_IDX, CCTV_IDX, CAPTURE_PATH) 
            VALUES (%s, %s, %s)
            """
            cursor.execute(sql_insert, (missing_id, cctv_idx, s3_url))
            if s3_url:
                # TB_USER 테이블 업데이트
                user_id = missing[1]
                if user_id:
                    sql_update_user = """
                    UPDATE TB_USER SET USER_ALARM_CK = 0
                    WHERE USER_ID = %s AND USER_ALARM_CK = 1
                    """
                    cursor.execute(sql_update_user, (user_id,))
        db.commit()

        return jsonify(result)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()
