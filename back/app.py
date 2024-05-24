from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from KakaoLogin import kakao_callback

# 환경 변수 로드
load_dotenv()

app = Flask(__name__)
CORS(app)

app.add_url_rule('/user/kakao/callback',
                 view_func=kakao_callback, methods=['GET', 'POST'])

if __name__ == '__main__' :
    app.run(debug=True, port=5000)