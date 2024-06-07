from flask import Blueprint, request, jsonify, session, redirect, Flask
import requests
import os
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

app = Flask(__name__)

# 환경 변수에서 카카오 클라이언트 ID 및 리다이렉트 URI를 가져옵니다.
KAKAO_CLIENT_ID = os.environ.get('KAKAO_CLIENT_ID')
KAKAO_REDIRECT_URI = os.environ.get('KAKAO_REDIRECT_URI')

# Flask Blueprint를 생성합니다.
kakao_bp = Blueprint('kakao', __name__)

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

    # 카카오 정보가 정확히 넘어왔다면 로그인 성공으로 원하는 페이지로 이동
    #if user_info['id'] is not None:
    #    return redirect('/')  # 메인 페이지로 이동 (라우트 이름에 맞게 변경)

    return jsonify({'error': 'User information is invalid'}), 400

if __name__ == '__main__':
   app.run('0.0.0.0',port=5000,debug=True)