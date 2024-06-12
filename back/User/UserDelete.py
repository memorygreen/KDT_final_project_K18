from flask import Blueprint, request, jsonify
from db import db_con

UserDelete_bp = Blueprint('UserDelete', __name__)

# 회원탈퇴기능 나중에 회원정보 수정하는 백에 옮겨야함!!!!
@UserDelete_bp.route('/UserDelete', methods=['POST'])
def UserDelete():
    user_id = request.json.get('userId')
    db = db_con()
    cursor = db.cursor()
    try:
        delete_sql = "DELETE FROM TB_USER WHERE USER_ID = %s"
        cursor.execute(delete_sql, (user_id,))
        db.commit()
        return jsonify({"message": "회원탈퇴 완료"})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        db.close()
