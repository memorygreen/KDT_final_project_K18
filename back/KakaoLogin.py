# kakao_login.py
import requests
import os
from flask import request, jsonify
from dotenv import load_dotenv


# 환경 변수 로드
load_dotenv()

KAKAO_CLIENT_ID = os.environ.get('KAKAO_CLIENT_ID')
KAKAO_REDIRECT_URI = os.environ.get('KAKAO_REDIRECT_URI')


def get_access_token(auth_code):
    data = {
        'grant_type': 'authorization_code',
        'client_id': KAKAO_CLIENT_ID,
        'redirect_uri': KAKAO_REDIRECT_URI,
        'code': auth_code
    }
    response = requests.post('https://kauth.kakao.com/oauth/token', data=data)
    if response.status_code != 200:
        print(f"Failed to get access token: {response.json()}")
        return None
    access_token = response.json().get('access_token')
    return access_token

def get_user_info(access_token):
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    response = requests.get('https://kapi.kakao.com/v2/user/me', headers=headers)
    if response.status_code != 200:
        print(f"Failed to get user info: {response.json()}")
        return None
    user_info = response.json()
    return user_info

def kakao_callback():
    # 1. 카카오 로그인 인증 코드 받기
    code = request.args.get('code')
    print("카카오 로그인 인증 코드: ", code)
    
    if not code:
        return jsonify({'error': 'Authorization code not found'}), 400

    # 2. 인증 코드를 사용하여 액세스 토큰 받기
    access_token = get_access_token(code)
    if not access_token:
        return jsonify({'error': 'Failed to get access token'}), 400
    print("액세스 토큰: ", access_token)
    
    # 3. 액세스 토큰을 사용하여 사용자 정보 받기
    user_info = get_user_info(access_token)
    if not user_info:
        return jsonify({'error': 'Failed to get user info'}), 400
    print("사용자 정보: ", user_info)

    return jsonify(user_info)
