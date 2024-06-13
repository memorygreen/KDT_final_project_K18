from flask import Blueprint, request, jsonify
import os
import openai
import boto3
import base64
from io import BytesIO
from PIL import Image
import requests
from urllib.parse import quote
import uuid

# 환경 변수에서 API 키 로드
API_KEY = os.getenv("FLASK_API_KEY")
S3_BUCKET = os.getenv("S3_BUCKET")
S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY")
S3_SECRET_KEY = os.getenv("S3_SECRET_KEY")
S3_REGION = os.getenv("S3_REGION")

openai.api_key = API_KEY

openai_bp = Blueprint('openai', __name__)

# S3 클라이언트 설정
s3_client = boto3.client(
    's3',
    aws_access_key_id=S3_ACCESS_KEY,
    aws_secret_access_key=S3_SECRET_KEY,
    region_name=S3_REGION
)


@openai_bp.route('/generate-image', methods=['POST'])
def generate_image():
    data = request.json
    prompt = data.get('prompt')
    print(prompt)
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
        image_response = requests.get(image_url)
        image_data = image_response.content
        image = Image.open(BytesIO(image_data))

        # S3에 업로드
        random_filename = str(uuid.uuid4())  # 임의의 문자열로 파일 이름 생성
        image_key = f"generated_images/{random_filename}.png"
        buffer = BytesIO()
        try:
            image.save(buffer, 'PNG')
            buffer.seek(0)
            s3_client.upload_fileobj(buffer, S3_BUCKET, image_key, ExtraArgs={
                'ContentType': 'image/png'
            })
        finally:
            buffer.close()

        image_url = f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/{image_key}"
        return jsonify({"image_url": image_url})

    except Exception as e:
        print(f"Error generating image: {e}")
        return jsonify({"error": str(e)}), 500
