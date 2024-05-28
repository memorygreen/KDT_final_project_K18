# openAI.py

from flask import request, jsonify
import os
import openai

# 환경 변수에서 API 키 로드
API_KEY = os.getenv("FLASK_API_KEY")
openai.api_key = API_KEY


def generate_image():
    data = request.json
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

# Optional
# Defaults to url
# The format in which the generated images are returned
# Must be one of url or b64_json. 
# URLs are only valid for 60 minutes after the image has been generated.
    try:
        response = openai.images.generate(
            # b64_json.로 받는 코드 추가 작성
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            n=1,
        )
        image_url = response.data[0].url
        # b64_json.로 받아서 db에 저장을 같이 해야함 (현재는 유효기간 30분짜리 url)
        return image_url
    except Exception as e:
        print(f"Error generating image: {e}")
        return jsonify({"error": str(e)}), 500
