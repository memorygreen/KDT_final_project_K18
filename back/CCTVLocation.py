from db import db_con
import pymysql
from flask import Blueprint, request, jsonify

cctv_bp = Blueprint('CCTVLocation', __name__)


@cctv_bp.route('/CCTVLocation', methods=['GET'])
def get_all_CCTV():
    try:
        # 데이터베이스 연결
        db = db_con()
        cursor = db.cursor(pymysql.cursors.DictCursor)
        # SQL 쿼리 작성
        sql = "SELECT * FROM TB_CCTV"
        # 쿼리 실행
        cursor.execute(sql)
        # 결과 가져오기
        cctv_data = cursor.fetchall()
        # 연결 및 커서 닫기
        cursor.close()
        db.close()
        # JSON 응답 반환
        return jsonify(cctv_data), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
