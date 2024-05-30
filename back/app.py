from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from KakaoLogin import kakao_bp
from OpenAI import openai_bp
from post import post_bp
from CCTVLocation import cctv_bp
from report import report_bp


# 환경 변수 로드
load_dotenv()

app = Flask(__name__)
CORS(app)

# 블루프린트 등록
app.register_blueprint(kakao_bp)

# 이미지 생성 엔드포인트 추가
app.register_blueprint(openai_bp)

# 포스터 관련 엔드포인트
app.register_blueprint(post_bp)

#CCTV 위치 엔드포인트
app.register_blueprint(cctv_bp)

# 제보하는 엔드포인트
app.register_blueprint(report_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
