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
from Adminmissing import Adminmissing_bp
from searchMissing import search_missing_bp
from UserDelete import UserDelete_bp
from getCCTV import get_CCTV_bp
from getSearchMissing import get_search_missing_bp
from getAllMissing import get_all_missing_bp

# 환경 변수 로드
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# 시크릿 키 설정
app.secret_key = 'your_secret_key_here'

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
app.register_blueprint(Adminmissing_bp)
app.register_blueprint(search_missing_bp)  # 자영 실종자 검색 기능 블루프린트 등록
app.register_blueprint(UserDelete_bp)
app.register_blueprint(get_CCTV_bp) # 자영(240605) CCTV 상세보기 기능 블루프린트 등록
app.register_blueprint(get_search_missing_bp) # 자영(240605) 실종자 인상착의 가져오기
app.register_blueprint(get_all_missing_bp) # 자영(240605) 세션에 담긴 userid가 등록한 모든 실종자 가져오기

if __name__ == '__main__':
    app.run(debug=True, port=5000)
