from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
# 다른 모듈에서 블루프린트를 가져오기
from KakaoLogin import kakao_bp
from OpenAI import openai_bp
from post import post_bp
from CCTVLocation import cctv_bp
from report import report_bp
from SignUp import signup_bp  # SignUp 블루프린트 가져오기
from Admin import Admin_bp
from Adminmanage import Adminmanage_bp
from Admincctv import Admincctv_bp
# 환경 변수 로드
load_dotenv()

app = Flask(__name__)
CORS(app,resources={r"/*": {"origins": "*"}})

# 블루프린트 등록
app.register_blueprint(kakao_bp)
app.register_blueprint(openai_bp)
app.register_blueprint(post_bp)
app.register_blueprint(cctv_bp)
app.register_blueprint(report_bp)
app.register_blueprint(signup_bp)  # SignUp 블루프린트 등록
app.register_blueprint(Admin_bp)
app.register_blueprint(Adminmanage_bp)
app.register_blueprint(Admincctv_bp)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
