from flask import Blueprint, request, jsonify
import pymysql
from db import db_con


post_bp = Blueprint('post', __name__)


@post_bp.route('/missing_info', methods=['GET'])
def get_all_missing_info():
    db = db_con()
    cursor = db.cursor()

    # 실종자 정보 가져오기 (테이블 이름을 정확하게 확인하고 수정)
    sql_missing = "SELECT * FROM TB_MISSING"
    cursor.execute(sql_missing)
    missings = cursor.fetchall()

    result = []
    for missing in missings:
        missing_idx = missing[0]

        # 실종자 옷 정보 가져오기
        sql_clothes = "SELECT * FROM TB_MISSING_CLOTHES WHERE MISSING_IDX=%s"
        cursor.execute(sql_clothes, (missing_idx,))
        clothes = cursor.fetchall()

        # 포스터 정보 가져오기
        sql_poster = "SELECT * FROM TB_POSTER WHERE MISSING_IDX=%s"
        cursor.execute(sql_poster, (missing_idx,))
        poster = cursor.fetchone()

        missing_info = {
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
                'MISSING_TOP': cloth[2],
                'MISSING_TOP_COLOR': cloth[3],
                'MISSING_BOTTOMS': cloth[4],
                'MISSING_BOTTOMS_COLOR': cloth[5],
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
        result.append(missing_info)

    cursor.close()
    db.close()

    return jsonify(result)
