import mysql.connector
import os
from flask_socketio import emit
from . import socketio

# 환경 변수 로드
from dotenv import load_dotenv
load_dotenv()

# MySQL 연결 설정은 환경 변수를 이용하여 동적으로 설정
db_config = {
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'database': os.getenv('DB_NAME'),
    'port': int(os.getenv('DB_PORT')),
    'charset': 'utf8'
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

def notify_on_event(event_data):
    user_id = event_data.get('user_id')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM TB_NOTIFICATION WHERE USER_ID = %s ORDER BY CREATED_AT DESC LIMIT 1", (user_id,))
    latest_notification = cursor.fetchone()
    cursor.close()
    conn.close()

    if latest_notification:
        socketio.emit('notification', latest_notification, room=user_id)

@socketio.on('event_occurred')
def handle_event(event_data):
    notify_on_event(event_data)
