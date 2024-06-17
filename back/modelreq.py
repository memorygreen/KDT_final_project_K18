from celery import Celery
import requests
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Create Celery app with environment variables
app = Celery('modelreq', broker=os.getenv('CELERY_BROKER_URL'), backend=os.getenv('CELERY_RESULT_BACKEND'))

@app.task
def send_request_to_external_server():
    try:
        external_url = os.getenv('EXTERNAL_SERVER_URL')
        headers = {'Content-Type': 'application/json'}
        response = requests.post(external_url, headers=headers)
        print(f"Response from external server: {response.json()}")
    except Exception as e:
        print(f"Error occurred while sending request to external server: {e}")
