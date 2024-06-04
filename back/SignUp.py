import bcrypt
from flask import Blueprint, request, jsonify
from db import db_con
import os

# .env 파일에서 SECRET_KEY 불러오기
SECRET_KEY = os.getenv('SECRET_KEY')

signup_bp = Blueprint('signup', __name__)

# 비밀번호를 bcrypt로 해싱하는 함수
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# 비밀번호 비교 함수
def check_password(hashed_password, password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password)

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

    # 성별을 한 글자로 변환
    if user_gender.lower() == 'male':
        user_gender = 'M'
    elif user_gender.lower() == 'female':
        user_gender = 'F'
    else:
        return jsonify({'message': 'Invalid gender'}), 400

    try:
        # 비밀번호를 bcrypt로 해싱하여 저장
        hashed_password = hash_password(user_pw)

        connection = db_con()
        with connection.cursor() as cursor:
            sql = """
            INSERT INTO TB_USER (USER_ID, USER_PW, USER_NAME, USER_BRT_DT, USER_GENDER, USER_PHONE) 
            VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (user_id, hashed_password, user_name, user_brt_dt, user_gender, user_phone))
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
    print(provided_pw)

    try:
        connection = db_con()
        with connection.cursor() as cursor:
            sql = "SELECT USER_PW, USER_STATUS FROM TB_USER WHERE USER_ID = %s"
            cursor.execute(sql, (user_id,))
            user_data = cursor.fetchone()

            if user_data is None:
                return jsonify({'message': 'User not found'}), 404

            hashed_password_from_db, user_status = user_data  # 저장된 bcrypt 해시 비밀번호와 상태 가져오기
            print(hashed_password_from_db)
            if user_status == 'stop':
                return jsonify({'message': 'Account is suspended'}), 403  # 계정 사용 정지

            # 데이터베이스에서 가져온 해시 비밀번호를 bytes 형식으로 변환
            if isinstance(hashed_password_from_db, str):
                hashed_password_from_db = hashed_password_from_db.encode('utf-8')

            if check_password(hashed_password_from_db, provided_pw):
                # 로그인 성공
                return jsonify({'message': 'Login successful'}), 200
            else:
                # 비밀번호 불일치
                return jsonify({'message': 'Invalid password'}), 401
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    finally:
        connection.close()
