from quart import Quart, jsonify, request
from quart_cors import cors
from dotenv import load_dotenv
import os
import torch

# 환경 변수 로드
load_dotenv()

# main_model 모듈에서 블루프린트를 임포트
from main_model import main_model_bp  

app = Quart(__name__)
app = cors(app, allow_origin="*")

# 환경 변수 설정을 가져옴
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# 블루프린트 등록
app.register_blueprint(main_model_bp)

# GPU 사용 여부 확인 및 PyTorch, CUDA 버전 출력
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

print("PyTorch version:", torch.__version__)
print("CUDA version:", torch.version.cuda)
print("CUDA available:", torch.cuda.is_available())
if device.type == 'cuda':
    print(torch.cuda.get_device_name(0))
    print('Memory Usage:')
    print('Allocated:', round(torch.cuda.memory_allocated(0)/1024**3,1), 'GB')
    print('Cached:   ', round(torch.cuda.memory_reserved(0)/1024**3,1), 'GB')

# 인증 함수와 데코레이터 제거
# def check_auth(token):
#     """간단한 토큰 기반 인증"""
#     return token == app.config['SECRET_KEY']

# def requires_auth(f):
#     """인증을 요구하는 데코레이터"""
#     async def decorated(*args, **kwargs):
#         token = request.headers.get('Authorization')
#         if not token or not check_auth(token):
#             return jsonify({'message': 'Unauthorized'}), 401
#         return await f(*args, **kwargs)
#     return decorated

@app.route('/protected', methods=['GET'])
# @requires_auth
async def protected_route():
    return jsonify({'message': 'This is a protected route'})

# main_model의 엔드포인트를 인증 데코레이터로 래핑
@app.before_serving
async def setup_routes():
    for rule in app.url_map.iter_rules():
        if rule.endpoint.startswith('main_model.'):
            original_handler = app.view_functions[rule.endpoint]
            # app.view_functions[rule.endpoint] = requires_auth(original_handler)  # 인증 제거

if __name__ == '__main__':
    host = os.getenv('FLASK_RUN_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_RUN_PORT', 5050))
    app.run(host=host, port=port, debug=True)
