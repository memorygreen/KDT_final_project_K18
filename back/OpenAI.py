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
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    try:
        response = openai.Image.create(
            prompt=prompt,
            size="1024x1024",
            n=1,
            response_format="b64_json"  # Change to b64_json to get the image data directly
        )
        image_data = response['data'][0]['b64_json']
        # Here you can add logic to save the image_data to a database if needed
        return jsonify({"image_data": image_data})
    except Exception as e:
        print(f"Error generating image: {e}")
        return jsonify({"error": str(e)}), 500
