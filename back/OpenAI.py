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

    try:
        response = openai.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            n=1,
        )
        image_url = response.data[0].url
        return image_url
    except Exception as e:
        print(f"Error generating image: {e}")
        return jsonify({"error": str(e)}), 500
