from db import db_con
from flask import Blueprint, request, jsonify

Adminmanage_bp = Blueprint('Adminmanage', __name__)

@Adminmanage_bp.route('/user_post', methods=['POST'])
def get_user_post():
    db = db_con()
    cursor = db.cursor()

    # 요청 본문에서 user_id 가져오기
    data = request.get_json()
    user_id = data.get('id')

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    # 특정 사용자 포스터 정보 가져오기
    post_sql = "SELECT * FROM TB_MISSING WHERE USER_ID=%s"
    cursor.execute(post_sql, (user_id,))
    user_poster = cursor.fetchall()

    result = []
    for missing in user_poster:
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

@Adminmanage_bp.route("/delete_poster", methods=["POST"])
def handle_delete():
    poster_idx = request.json['poster_idx']
    db = db_con()
    cursor = db.cursor()
    try:
        update_sql = "UPDATE TB_POSTER SET POSTER_SHOW = 0 WHERE POSTER_IDX = %s"
        cursor.execute(update_sql, (poster_idx,))
        db.commit()
        return jsonify({"message": "포스터 상태가 '글내림'으로 변경되었습니다."})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        db.close()
