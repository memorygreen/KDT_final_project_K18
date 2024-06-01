from flask import Blueprint, request, jsonify
import os
import openai

# 환경 변수에서 API 키 로드
API_KEY = os.getenv("FLASK_API_KEY")
openai.api_key = API_KEY

openai_bp = Blueprint('openai', __name__)


@openai_bp.route('/generate-image', methods=['POST'])
def generate_image():
    data = request.json
    print(data)
    prompt = data.get('prompt')
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    try:
        response = openai.images.generate(
            # b64_json.로 받는 코드 추가 작성
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            n=1,
        )
        print(response)
        image_url = response.data[0].url
        # b64_json.로 받아서 db에 저장을 같이 해야함 (현재는 유효기간 30분짜리 url)
        return image_url
    except Exception as e:
        print(f"Error generating image: {e}")
        return jsonify({"error": str(e)}), 500
