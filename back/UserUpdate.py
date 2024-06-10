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

@user_update_bp.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    session_user_id = session.get('user_id')
    if not session_user_id:
        return jsonify({'error': '로그인이 필요합니다'}), 401

    if user_id != session_user_id:
        return jsonify({'error': '본인의 정보만 수정할 수 있습니다'}), 403

    user_data = request.get_json()
    name = user_data.get('name')
    password = user_data.get('password')
    dob = user_data.get('dob')
    gender = user_data.get('gender')
    phone = user_data.get('phone')

    if not name or not dob or not gender or not phone:
        return jsonify({'error': '모든 필드를 입력해주세요'}), 400

    if len(name) > 15:
        return jsonify({'error': '이름은 15자 이하로 입력해주세요'}), 400

    connection = db_con()
    cursor = connection.cursor()

    try:
        if password:
            cursor.execute('UPDATE users SET password = %s WHERE id = %s', (password, user_id))

        cursor.execute('''
            UPDATE users
            SET name = %s, dob = %s, gender = %s, phone = %s
            WHERE id = %s
        ''', (name, dob, gender, phone, user_id))

        connection.commit()
        return jsonify({'message': '회원 정보가 성공적으로 수정되었습니다'}), 200
    except Exception as e:
        connection.rollback()
        return jsonify({'error': '회원 정보 수정 중 오류가 발생했습니다', 'details': str(e)}), 500
    finally:
        cursor.close()
        connection.close()
