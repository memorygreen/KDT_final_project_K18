from flask import Blueprint, request, jsonify, session
import requests
import os
from dotenv import load_dotenv

load_dotenv()

KAKAO_CLIENT_ID = os.environ.get('KAKAO_CLIENT_ID')
KAKAO_REDIRECT_URI = os.environ.get('KAKAO_REDIRECT_URI')

kakao_bp = Blueprint('kakao', __name__)

def get_access_token(auth_code):
    data = {
        'grant_type': 'authorization_code',
        'client_id': KAKAO_CLIENT_ID,
        'redirect_uri': KAKAO_REDIRECT_URI,
        'code': auth_code
    }
    response = requests.post('https://kauth.kakao.com/oauth/token', data=data)
    if response.status_code != 200:
        return None
    access_token = response.json().get('access_token')
    return access_token

def get_user_info(access_token):
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    response = requests.get('https://kapi.kakao.com/v2/user/me', headers=headers)
    if response.status_code != 200:
        return None
    user_info = response.json()
    return user_info

@kakao_bp.route('/user/kakao/callback', methods=['GET'])
def kakao_callback():
    code = request.args.get('code')
    if not code:
        return jsonify({'error': 'Authorization code not found'}), 400

    access_token = get_access_token(code)
    if not access_token:
        return jsonify({'error': 'Failed to get access token'}), 400

    user_info = get_user_info(access_token)
    if not user_info:
        return jsonify({'error': 'Failed to get user info'}), 400

    session['user_id'] = user_info['id']
    session['user_name'] = user_info['properties']['nickname']

    return jsonify({
        'token': access_token,
        'user': {
            'id': user_info['id'],
            'name': user_info['properties']['nickname']
        }
    })
