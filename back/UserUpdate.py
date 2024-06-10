from flask import Blueprint, request, jsonify, session
import pymysql
from dotenv import load_dotenv
import os

load_dotenv()

def db_con():
    return pymysql.connect(
        host='project-db-cgi.smhrd.com',
        user='campus_23K_AI18_p3_2',
        password='smhrd2',
        db='campus_23K_AI18_p3_2',
        port=3307,
        charset='utf8'
    )

user_update_bp = Blueprint('user_update', __name__)

@user_update_bp.route('/api/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    session_user_id = session.get('user_id')
    if not session_user_id:
        return jsonify({'error': '로그인이 필요합니다'}), 401

    if user_id != session_user_id:
        return jsonify({'error': '본인의 정보만 수정할 수 있습니다'}), 403

    user_data = request.json
    name = user_data.get('name')
    dob = user_data.get('dob')
    gender = user_data.get('gender')
    phone = user_data.get('phone')
    password = user_data.get('password')

    if not (name and dob and gender and phone):
        return jsonify({'error': '모든 필드를 입력해야 합니다'}), 400

    try:
        conn = db_con()
        cursor = conn.cursor()

        update_query = """
        UPDATE user 
        SET user_name = %s, user_dob = %s, user_gender = %s, user_phone = %s
        """
        
        update_data = [name, dob, gender, phone]

        if password:
            update_query += ", user_pw = %s"
            update_data.append(password)

        update_query += " WHERE user_id = %s"
        update_data.append(user_id)

        cursor.execute(update_query, update_data)
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'message': '회원정보가 성공적으로 수정되었습니다'}), 200

    except Exception as e:
        return jsonify({'error': '회원정보 수정 중 오류가 발생했습니다', 'details': str(e)}), 500
