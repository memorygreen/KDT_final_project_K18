from flask import Blueprint, request, jsonify
from db import db_con

user_update_bp = Blueprint('user_update', __name__)

@user_update_bp.route('/UserUpdate/<user_id>', methods=['PUT'])
def update_user(user_id):
    pw = request.json.get('password')  # 패스워드를 요청에서 가져옴
    db = db_con()
    cursor = db.cursor()
    try:
        if pw:  # 패스워드가 있는 경우에만 업데이트
            update_sql = "UPDATE TB_USER SET USER_PW = %s WHERE USER_ID = %s"
            cursor.execute(update_sql, (pw, user_id))
            db.commit()
            return jsonify({"message": "비밀번호 수정 완료"}), 200
        else:
            return jsonify({"error": "패스워드가 제공되지 않았습니다."}), 400
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()
