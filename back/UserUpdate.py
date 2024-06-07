from flask import Blueprint, request, jsonify, session
import pymysql
from dotenv import load_dotenv
import os

load_dotenv()

# 새로운 DB 연결 함수
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
    # 세션에서 사용자 ID 가져오기
    session_user_id = session.get('user_id')
    if not session_user_id:
        return jsonify({'error': '로그인이 필요합니다'}), 401

    # 요청된 사용자 ID와 세션의 사용자 ID가 일치하는지 확인
    if user_id != session_user_id:
        return jsonify({'error': '본인의 정보만 수정할 수 있습니다'}), 403

    # 요청으로부터 받은 데이터 추출
    user_data = request.get_json()
    name = user_data.get('name')
    password = user_data.get('password')
    dob = user_data.get('dob')
    gender = user_data.get('gender')
    phone = user_data.get('phone')

    # 입력값 유효성 검사
    if not name or not dob or not gender or not phone:
        return jsonify({'error': '모든 필드를 입력해주세요'}), 400

    # DB 연결
    connection = db_con()
    cursor = connection.cursor()

    try:
        # 비밀번호 변경
        if password:
            cursor.execute('UPDATE users SET password = %s WHERE id = %s', (password, user_id))

        # 사용자 정보 업데이트
        cursor.execute('''
            UPDATE users
            SET name = %s, dob = %s, gender = %s, phone = %s
            WHERE id = %s
        ''', (name, dob, gender, phone, user_id))

        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({'message': '회원 정보가 성공적으로 수정되었습니다'}), 200
    except Exception as e:
        return jsonify({'error': '회원 정보 수정 중 오류가 발생했습니다'}), 500
