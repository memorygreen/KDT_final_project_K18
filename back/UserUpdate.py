from flask import Blueprint, request, jsonify
from db import db_con

user_update_bp = Blueprint('user_update', __name__)

@user_update_bp.route('/api/users/<user_id>', methods=['POST'])
def update_user(user_id):
    pw = request.json.get('password')  # 패스워드를 요청에서 가져옴
    db = db_con()
    cursor = db.cursor()
    try:
        update_sql = "UPDATE TB_USER SET USER_PW = %s WHERE USER_ID = %s"
        cursor.execute(update_sql, (pw, user_id))
        db.commit()
        return jsonify({"message": "회원정보 수정 완료"})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        db.close()
