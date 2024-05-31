from flask import Blueprint, request, jsonify
import jwt
import datetime
from db import db_con
import os  # os 모듈 추가

# .env 파일에서 SECRET_KEY 불러오기
SECRET_KEY = os.getenv('SECRET_KEY')


signup_bp = Blueprint('signup', __name__)

# 비밀번호를 JWT로 인코딩하는 함수
def encode_password(password):
    # JWT payload에 저장할 데이터 설정
    payload = {
        'password': password,
        # 토큰 만료 기간 설정 (예: 1시간)
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    # JWT 생성
    encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return encoded_jwt

@signup_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    user_id = data.get('id')
    user_pw = data.get('password')
    confirm_pw = data.get('confirm_password')
    user_name = data.get('name')
    user_brt_dt = data.get('dob')
    user_gender = data.get('gender')
    user_phone = data.get('phone')

    if user_pw != confirm_pw:
        return jsonify({'message': 'Passwords do not match'}), 400

    # Convert gender to single character
    if user_gender.lower() == 'male':
        user_gender = 'M'
    elif user_gender.lower() == 'female':
        user_gender = 'F'
    else:
        return jsonify({'message': 'Invalid gender'}), 400

    try:
        # 비밀번호를 JWT로 인코딩하여 저장
        encoded_password = encode_password(user_pw)

        connection = db_con()
        with connection.cursor() as cursor:
            sql = """
            INSERT INTO TB_USER (USER_ID, USER_PW, USER_NAME, USER_BRT_DT, USER_GENDER, USER_PHONE) 
            VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (user_id, encoded_password, user_name, user_brt_dt, user_gender, user_phone))
            connection.commit()
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    finally:
        connection.close()

    return jsonify({'message': 'User registered successfully'}), 201

@signup_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user_id = data.get('id')
    provided_pw = data.get('password')

    try:
        connection = db_con()
        with connection.cursor() as cursor:
            sql = "SELECT USER_PW FROM TB_USER WHERE USER_ID = %s"
            cursor.execute(sql, (user_id,))
            encoded_password_from_db = cursor.fetchone()[0]  # 디코딩 전의 저장된 JWT 비밀번호 가져오기

            decoded = jwt.decode(encoded_password_from_db, SECRET_KEY, algorithms=['HS256'])
            saved_password = decoded['password']
            if provided_pw == saved_password:
                # 로그인 성공
                return jsonify({'message': 'Login successful'}), 200
            else:
                # 비밀번호 불일치
                return jsonify({'message': 'Invalid password'}), 401
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    finally:
        connection.close()
