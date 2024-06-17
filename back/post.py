from flask import Blueprint, request, jsonify, session
import pymysql
from flask_cors import CORS
from datetime import datetime, timedelta
from db import db_con
import logging
from apscheduler.schedulers.background import BackgroundScheduler

post_bp = Blueprint('post', __name__)
scheduler = BackgroundScheduler()
scheduler.start()

# 포스터 조회


@post_bp.route('/missing_info', methods=['GET'])
def get_all_missing_info():
    db = db_con()
    cursor = db.cursor()

    # 실종자 정보 가져오기 (테이블 이름을 정확하게 확인하고 수정).
    sql_missing = "SELECT * FROM TB_MISSING WHERE MISSING_FINDING='finding'ORDER BY MISSING_IDX DESC"
    cursor.execute(sql_missing)
    missings = cursor.fetchall()

    result = []
    for missing in missings:
        missing_idx = missing[0]

        # 실종자 옷 정보 가져오기
        sql_clothes = """
            SELECT MISSING_CLOTHES_IDX, MISSING_IDX, MISSING_TOP_KOR, MISSING_TOP_COLOR_KOR,
                   MISSING_BOTTOMS_KOR, MISSING_BOTTOMS_COLOR_KOR, MISSING_CLOTHES_ETC
            FROM TB_MISSING_CLOTHES
            WHERE MISSING_IDX = %s
        """
        cursor.execute(sql_clothes, (missing_idx,))
        clothes = cursor.fetchall()

        # 포스터 정보 가져오기
        sql_poster = """
            SELECT * FROM TB_POSTER WHERE MISSING_IDX=%s AND POSTER_SHOW=1
        """
        cursor.execute(sql_poster, (missing_idx,))
        poster = cursor.fetchone()

        # POSTER_IMG_PATH가 null이 아닌 경우만 결과에 추가
        if poster and poster[4] is not None:
            missing_info = {
                'MISSING_IDX': missing[0],
                'USER_ID': missing[1],
                'MISSING_NAME': missing[2],
                'MISSING_GENDER': missing[3],
                'MISSING_AGE_CATE': missing[4],
                'MISSING_IMG': missing[5],
                'MISSING_LOCATION_LAT': missing[6],
                'MISSING_LOCATION_LON': missing[7],
                'MISSING_FINDING': missing[8],
                'MISSING_LOCATION': missing[9],
                'MISSING_AGE': missing[10],
                'MISSING_CLOTHES': [{
                    'MISSING_CLOTHES_IDX': cloth[0],
                    'MISSING_IDX': cloth[1],
                    'MISSING_TOP_KOR': cloth[2],
                    'MISSING_TOP_COLOR_KOR': cloth[3],
                    'MISSING_BOTTOMS_KOR': cloth[4],
                    'MISSING_BOTTOMS_COLOR_KOR': cloth[5],
                    'MISSING_CLOTHES_ETC': cloth[6]
                } for cloth in clothes],
                'POSTER_INFO': {
                    'POSTER_IDX': poster[0],
                    'MISSING_IDX': poster[1],
                    'POSTER_CREATED_AT': poster[2],
                    'POSTER_VIEW': poster[3],
                    'POSTER_IMG_PATH': poster[4],
                    'POSTER_SHOW': poster[5]
                }
            }
            result.append(missing_info)

    cursor.close()
    db.close()

    return jsonify(result)

# 작성한 실종자 정보 가져오기


@post_bp.route('/user_missing', methods=['GET'])
def user_missing():
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({'error': '사용자가 로그인되어 있지 않습니다.'}), 401

    db = db_con()
    cursor = db.cursor()

    try:
        # 사용자가 최근에 작성한 실종자 정보 조회
        sql_user_missing = """
            SELECT * FROM TB_MISSING
            WHERE USER_ID=%s
            ORDER BY MISSING_IDX DESC
            LIMIT 1
        """
        cursor.execute(sql_user_missing, (user_id,))
        missings = cursor.fetchall()

        result = []
        for missing in missings:
            missing_idx = missing[0]

            # 해당 실종자의 옷 정보 조회
            sql_clothes = """
                SELECT MISSING_CLOTHES_IDX, MISSING_IDX, MISSING_TOP_KOR, MISSING_TOP_COLOR_KOR,
                       MISSING_BOTTOMS_KOR, MISSING_BOTTOMS_COLOR_KOR, MISSING_CLOTHES_ETC
                FROM TB_MISSING_CLOTHES
                WHERE MISSING_IDX = %s
            """
            cursor.execute(sql_clothes, (missing_idx,))
            clothes = cursor.fetchall()

            # 해당 실종자의 포스터 정보 조회
            sql_poster = """
                SELECT * FROM TB_POSTER WHERE MISSING_IDX=%s
            """
            cursor.execute(sql_poster, (missing_idx,))
            poster = cursor.fetchone()

            user_missing_info = {
                'MISSING_IDX': missing[0],
                'USER_ID': missing[1],
                'MISSING_NAME': missing[2],
                'MISSING_GENDER': missing[3],
                'MISSING_AGE': missing[4],
                'MISSING_IMG': missing[5],
                'MISSING_LOCATION_LAT': missing[6],
                'MISSING_LOCATION_LON': missing[7],
                'MISSING_FINDING': missing[8],
                'MISSING_CLOTHES': [{
                    'MISSING_CLOTHES_IDX': cloth[0],
                    'MISSING_IDX': cloth[1],
                    'MISSING_TOP_KOR': cloth[2],
                    'MISSING_TOP_COLOR_KOR': cloth[3],
                    'MISSING_BOTTOMS_KOR': cloth[4],
                    'MISSING_BOTTOMS_COLOR_KOR': cloth[5],
                    'MISSING_CLOTHES_ETC': cloth[6]
                } for cloth in clothes],
                'POSTER_INFO': {
                    'POSTER_IDX': poster[0] if poster else None,
                    'MISSING_IDX': poster[1] if poster else None,
                    'POSTER_CREATED_AT': poster[2] if poster else None,
                    'POSTER_VIEW': poster[3] if poster else None,
                    'POSTER_IMG_PATH': poster[4] if poster else None,
                    'POSTER_SHOW': poster[5] if poster else None
                }
            }
            result.append(user_missing_info)

        cursor.close()
        db.close()

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 포스터 생성 기능


@post_bp.route('/create_poster', methods=['POST'])
def create_poster():
    try:
        user_id = request.json.get('user_id')
        poster_img_path = request.json.get('poster_img_path')
        if not user_id:
            return jsonify({'error': '사용자가 로그인되어 있지 않습니다.'}), 401

        db = db_con()
        cursor = db.cursor()

        # 사용자가 최근에 작성한 실종자 정보 조회
        sql_user_missing = """
            SELECT * FROM TB_MISSING
            WHERE USER_ID=%s
            ORDER BY MISSING_IDX DESC
            LIMIT 1
        """
        cursor.execute(sql_user_missing, (user_id,))
        missing = cursor.fetchone()

        if not missing:
            return jsonify({'error': '로그인한 사용자에 대한 실종자 정보가 없습니다.'}), 404

        missing_idx = missing[0]

        # 포스터 생성 및 삽입
        sql_insert_poster = """
            INSERT INTO TB_POSTER (
                MISSING_IDX,
                POSTER_IMG_PATH
            ) VALUES (%s, %s)
        """
        cursor.execute(sql_insert_poster, (missing_idx, poster_img_path))
        db.commit()

        return jsonify({'message': '포스터가 성공적으로 생성되었습니다.', 'MISSING_IDX': missing_idx}), 201

    except Exception as e:
        logging.error("포스터 생성 중 오류 발생: %s", str(e))
        db.rollback()
        return jsonify({'error': '포스터 생성 중 오류가 발생했습니다. 나중에 다시 시도해주세요.'}), 500
    finally:
        cursor.close()
        db.close()

# 포스터 비활성화


@post_bp.route('/post_no_show', methods=['POST'])
def disable_poster():
    try:
        poster_idx = request.json.get('poster_idx')
        if not poster_idx:
            return jsonify({"error": "포스터 IDX가 누락되었습니다."}), 400
        db = db_con()
        cursor = db.cursor()

        cursor.execute(
            "SELECT POSTER_SHOW FROM TB_POSTER WHERE POSTER_IDX = %s", (poster_idx,))
        current_notification = cursor.fetchone()

        if current_notification and current_notification[0] == 0:
            # POSTER_SHOW가 0인 경우에만 업데이트
            sql_poster_update = """
            UPDATE TB_POSTER
            SET POSTER_SHOW = 0
            WHERE POSTER_IDX = %s
            """
            cursor.execute(sql_poster_update, (poster_idx,))
            db.commit()

        cursor.close()
        db.close()

        return jsonify({"message": "포스터가 성공적으로 업데이트되었습니다."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@post_bp.route('/missing_info_oneuser', methods=['POST'])
def get_all_missing_info_oneuser():
    user_id = request.json.get('user_id')
    if not user_id:
        return jsonify({'error': '사용자가 로그인되어 있지 않습니다.'}), 401

    db = db_con()
    cursor = db.cursor()

    # 사용자의 실종자 정보 가져오기
    sql_missing = """
        SELECT * FROM TB_MISSING WHERE MISSING_FINDING='finding' AND USER_ID=%s
    """
    cursor.execute(sql_missing, (user_id,))
    missings = cursor.fetchall()

    result = []
    for missing in missings:
        missing_idx = missing[0]

        # 해당 실종자의 옷 정보 조회
        sql_clothes = """
            SELECT MISSING_CLOTHES_IDX, MISSING_IDX, MISSING_TOP_KOR, MISSING_TOP_COLOR_KOR,
                   MISSING_BOTTOMS_KOR, MISSING_BOTTOMS_COLOR_KOR, MISSING_CLOTHES_ETC
            FROM TB_MISSING_CLOTHES
            WHERE MISSING_IDX = %s
        """
        cursor.execute(sql_clothes, (missing_idx,))
        clothes = cursor.fetchall()

        # 해당 실종자의 포스터 정보 조회
        sql_poster = """
            SELECT * FROM TB_POSTER WHERE MISSING_IDX=%s
        """
        cursor.execute(sql_poster, (missing_idx,))
        poster = cursor.fetchone()

        # 포스터가 존재하는 경우에만 결과에 추가
        if poster:
            poster_info = {
                'POSTER_IDX': poster[0],
                'MISSING_IDX': poster[1],
                'POSTER_CREATED_AT': poster[2],
                'POSTER_VIEW': poster[3],
                'POSTER_IMG_PATH': poster[4],
                'POSTER_SHOW': poster[5]
            }
        else:
            poster_info = {
                'POSTER_IDX': None,
                'MISSING_IDX': None,
                'POSTER_CREATED_AT': None,
                'POSTER_VIEW': None,
                'POSTER_IMG_PATH': None,
                'POSTER_SHOW': None
            }

        missing_info = {
            'MISSING_IDX': missing[0],
            'USER_ID': missing[1],
            'MISSING_NAME': missing[2],
            'MISSING_GENDER': missing[3],
            'MISSING_AGE_CATE': missing[4],
            'MISSING_IMG': missing[5],
            'MISSING_LOCATION_LAT': missing[6],
            'MISSING_LOCATION_LON': missing[7],
            'MISSING_FINDING': missing[8],
            'MISSING_LOCATION': missing[9],
            'MISSING_AGE': missing[10],
            'MISSING_CLOTHES': [{
                'MISSING_CLOTHES_IDX': cloth[0],
                'MISSING_IDX': cloth[1],
                'MISSING_TOP_KOR': cloth[2],
                'MISSING_TOP_COLOR_KOR': cloth[3],
                'MISSING_BOTTOMS_KOR': cloth[4],
                'MISSING_BOTTOMS_COLOR_KOR': cloth[5],
                'MISSING_CLOTHES_ETC': cloth[6]
            } for cloth in clothes],
            'POSTER_INFO': poster_info
        }
        result.append(missing_info)

    cursor.close()
    db.close()

    return jsonify(result)
