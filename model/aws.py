import boto3
import uuid
import base64
import os
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

S3_BUCKET = os.getenv('REACT_APP_S3_BUCKET')
REGION = os.getenv('REACT_APP_REGION')
ACCESS_KEY = os.getenv('REACT_APP_ACCESS_KEY')
SECRET_ACCESS_KEY = os.getenv('REACT_APP_SECRET_ACCESS_KEY')

# AWS S3 클라이언트 설정
s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_ACCESS_KEY, region_name=REGION)

def upload_missing_img(file_path):
    try:
        with open(file_path, "rb") as f:
            base64_data = base64.b64encode(f.read()).decode('utf-8')
        
        file_type = file_path.split('.')[-1]
        # 폴더 경로를 포함한 key 생성
        key = f"results/{uuid.uuid4()}.{file_type}"
        base64_bytes = base64.b64decode(base64_data)

        # S3에 업로드할 파라미터 설정
        params = {
            'Bucket': S3_BUCKET,
            'Key': key,
            'Body': base64_bytes,
            'ACL': 'public-read',
            'ContentType': f'image/{file_type}'  # 이미지 파일 타입 지정
        }

        # 이미지 업로드
        s3.put_object(**params)
        image_url = f"https://{S3_BUCKET}.s3.{REGION}.amazonaws.com/{key}"
        print(f"Image uploaded successfully. URL: {image_url}")
        return image_url
    
    except Exception as e:
        print(f"Error uploading image: {e}")
        return None
