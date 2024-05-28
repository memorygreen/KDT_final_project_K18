from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from KakaoLogin import kakao_callback
from OpenAI import generate_image

# 환경 변수 로드
load_dotenv()

app = Flask(__name__)
CORS(app)

# 카카오 로그인 콜백 엔드포인트 추가
app.add_url_rule('/user/kakao/callback',
                view_func=kakao_callback, methods=['GET', 'POST'])

# 이미지 생성 엔드포인트 추가
app.add_url_rule('/generate-image', view_func=generate_image, methods=['POST'])

if __name__ == '__main__':
    app.run(debug=True, port=5000)
