from db import db_con
from flask import Blueprint, request, jsonify

Admincctv_bp = Blueprint('Admincctv', __name__)

@Admincctv_bp.route('/Admincctv', methods=['GET'])
def get_cctv():
    db = db_con()
    cursor = db.cursor()
    try:
        cctv_sql = "SELECT * FROM TB_CCTV ORDER BY CCTV_IDX"
        cursor.execute(cctv_sql)
        cctv_data = cursor.fetchall()  # 'fetchell'을 'fetchall'로 수정

        cctv = []
        for i in cctv_data:
            cctv.append({
                "CCTV_IDX": i[0],  # cctv 식별자
                "CCTV_LAT": i[1],  # 위도
                "CCTV_LNG": i[2],  # 경도
                "CCTV_LOAD_ADDRESS": i[3],  # cctv 설치장소
                "CCTV_PATH": i[4],  # cctv 영상경로
                "CCTV_STATUS": i[5]  # cctv 상태
            })

    finally:
        cursor.close()
        db.close()

    return jsonify(cctv)
