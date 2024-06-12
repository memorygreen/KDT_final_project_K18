from flask import Blueprint, request, jsonify
from db import db_con
import bcrypt

UserDelete_bp = Blueprint('UserDelete', __name__)

@UserDelete_bp.route('/VerifyPassword', methods=['POST'])
def verify_password():
    user_id = request.json.get('userId')
    password = request.json.get('password')
    db = db_con()
    cursor = db.cursor()
    try:
        cursor.execute("SELECT USER_PW FROM TB_USER WHERE USER_ID = %s", (user_id,))
        result = cursor.fetchone()
        if result and bcrypt.checkpw(password.encode('utf-8'), result[0].encode('utf-8')):
            return jsonify({"valid": True}), 200
        else:
            return jsonify({"valid": False}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()

@UserDelete_bp.route('/UserDelete', methods=['POST'])
def user_delete():
    user_id = request.json.get('userId')
    password = request.json.get('password')
    db = db_con()
    cursor = db.cursor()
    try:
        cursor.execute("SELECT USER_PW FROM TB_USER WHERE USER_ID = %s", (user_id,))
        result = cursor.fetchone()
        if result and bcrypt.checkpw(password.encode('utf-8'), result[0].encode('utf-8')):
            delete_sql = "DELETE FROM TB_USER WHERE USER_ID = %s"
            cursor.execute(delete_sql, (user_id,))
            db.commit()
            return jsonify({"message": "회원탈퇴 완료"}), 200
        else:
            return jsonify({"error": "비밀번호가 일치하지 않습니다."}), 401
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()
