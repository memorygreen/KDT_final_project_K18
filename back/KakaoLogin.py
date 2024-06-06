import requests
import os
import pymysql
from flask import Blueprint, request, jsonify, session
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

# 환경 변수에서 카카오 클라이언트 ID 및 리다이렉트 URI를 가져옵니다.
KAKAO_CLIENT_ID = os.environ.get('KAKAO_CLIENT_ID')
KAKAO_REDIRECT_URI = os.environ.get('KAKAO_REDIRECT_URI')

# Flask Blueprint를 생성합니다.
kakao_bp = Blueprint('kakao', __name__)

# DB 연결 함수를 정의합니다.
def db_con():
    return pymysql.connect(
        host='project-db-cgi.smhrd.com',
        user='campus_23K_AI18_p3_2',
        password='smhrd2',
        db='campus_23K_AI18_p3_2',
        port=3307,
        charset='utf8'
    )

# Kakao 인증 코드로부터 액세스 토큰을 가져오는 함수를 정의합니다.
def get_access_token(auth_code):
    # POST 요청에 필요한 데이터를 설정합니다.
    data = {
        'grant_type': 'authorization_code',
        'client_id': KAKAO_CLIENT_ID,
        'redirect_uri': KAKAO_REDIRECT_URI,
        'code': auth_code
    }
    # Kakao API로 요청을 보내고 응답을 받습니다.
    response = requests.post('https://kauth.kakao.com/oauth/token', data=data)
    # 응답 코드가 200이 아닌 경우 오류 메시지를 출력하고 None을 반환합니다.
    if response.status_code != 200:
        print(f"Failed to get access token: {response.json()}")
        return None
    # 응답에서 액세스 토큰을 추출하여 반환합니다.
    access_token = response.json().get('access_token')
    return access_token

# Kakao 사용자 정보를 가져오는 함수를 정의합니다.
def get_user_info(access_token):
    # 헤더에 액세스 토큰을 포함하여 요청을 보냅니다.
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    # Kakao API로 요청을 보내고 응답을 받습니다.
    response = requests.get('https://kapi.kakao.com/v2/user/me', headers=headers)
    # 응답 코드가 200이 아닌 경우 오류 메시지를 출력하고 None을 반환합니다.
    if response.status_code != 200:
        print(f"Failed to get user info: {response.json()}")
        return None
    # 응답에서 사용자 정보를 추출하여 반환합니다.
    user_info = response.json()
    return user_info

# Kakao 콜백 처리를 위한 라우트를 정의합니다.
@kakao_bp.route('/user/kakao/callback', methods=['GET', 'POST'])
def kakao_callback():
    # 콜백 URL에서 인증 코드를 가져옵니다.
    code = request.args.get('code')
    print("카카오 로그인 인증 코드: ", code)
    
    # 인증 코드가 없는 경우 오류 응답을 반환합니다.
    if not code:
        return jsonify({'error': 'Authorization code not found'}), 400

    # 인증 코드로부터 액세스 토큰을 가져옵니다.
    access_token = get_access_token(code)
    # 액세스 토큰을 가져오지 못한 경우 오류 응답을 반환합니다.
    if not access_token:
        return jsonify({'error': 'Failed to get access token'}), 400
    print("액세스 토큰: ", access_token)
    
    # 액세스 토큰을 사용하여 Kakao 사용자 정보를 가져옵니다.
    user_info = get_user_info(access_token)
    # 사용자 정보를 가져오지 못한 경우 오류 응답을 반환합니다.
    if not user_info:
        return jsonify({'error': 'Failed to get user info'}), 400
    print("사용자 정보: ", user_info)
    
    # 세션에 사용자 ID를 저장합니다.
    session['user_id'] = user_info['id']
    
    # TB_USER 테이블에 사용자 정보를 추가합니다.
    conn = db_con()
    cursor = conn.cursor()
    try:
        # 새로운 사용자 정보를 추가합니다.
        cursor.execute("""
            INSERT INTO TB_USER (USER_ID, USER_NAME) 
            VALUES (%s, %s)
        """, (session['user_id'], user_info['name']))
        conn.commit()
        
        # TB_USER 테이블에 추가된 사용자의 USER_ID를 가져옵니다.
        cursor.execute("""
            SELECT USER_ID FROM TB_USER WHERE USER_ID = %s
        """, (session['user_id'],))
        user_id = cursor.fetchone()[0]
        
        # 세션에 사용자 ID가 있는 경우에만 TB_AUTH 테이블에 값을 추가합니다.
        if 'user_id' in session:
            cursor.execute("""
                INSERT INTO TB_AUTH (AUTH_ID, SNS_PROVIDER, USER_ID) 
                VALUES (%s, %s, %s)
            """, (user_info['id'], 'KAKAO', user_id))
            conn.commit()
    except Exception as e:
        print(f"Failed to insert into TB_AUTH: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()
    
    # 성공적인 응답을 반환합니다.
    return jsonify({'token': access_token, 'user': user_info})

# Kakao 로그인 처리를 위한 라우트를 정의합니다.
@kakao_bp.route('/user/kakao/login', methods=['POST'])
def kakao_login():
    # POST 요청에서 사용자 ID를 가져옵니다.
    data = request.get_json()
    user_id = data.get('id')
    print(f"User ID received: {user_id}")

    # DB 연결을 수행합니다.
    conn = db_con()
    cursor = conn.cursor()

    try:
        # 사용자 ID를 이용하여 로그인을 처리합니다.
        cursor.execute("""
            SELECT u.USER_PW, u.USER_STATUS
            FROM TB_AUTH a
            JOIN TB_USER u ON a.USER_ID = u.USER_ID
            WHERE a.AUTH_ID = %s
        """, (user_id,))
        user_data = cursor.fetchone()
        print(f"User data from DB: {user_data}")

        # 사용자 데이터가 없는 경우 추가 정보 입력이 필요함을 나타내는 응답을 반환합니다.
        if user_data is None:
            return jsonify({'message': '추가적인 정보 입력이 필요합니다.', 'signup': True})
        
        # 사용자 데이터가 있는 경우 사용자의 비밀번호와 상태를 가져옵니다.
        user_pw, user_status = user_data
        
        # 사용자의 계정 상태가 정지된 경우 적절한 응답을 반환합니다.
        if user_status == 'stop':
            return jsonify({'message': 'Account is suspended'}), 403
        
        # 로그인이 성공한 경우 성공적인 응답을 반환합니다.
        return jsonify({'success': True})
        
    except Exception as e:
        # 데이터베이스 오류가 발생한 경우 적절한 오류 응답을 반환합니다.
        print(f"Database error: {e}")
        return jsonify({'error': 'Database error'}), 500
    finally:
        # 데이터베이스 커넥션과 커서를 닫습니다.
        cursor.close()
        conn.close()

