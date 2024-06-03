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


@Admincctv_bp.route("/user_cctv_change", methods= ["POST"])
def user_cctv_change():
    cctv_idx = request.json['chg_cctvidx']
    new_sta = request.json['chg_cctv']
    db = db_con()
    cursor = db.cursor()
    try:
        update_sql = "UPDATE TB_CCTV SET CCTV_STATUS = %s WHERE CCTV_IDX = %s"
        cursor.execute(update_sql, (new_sta, cctv_idx))
        db.commit()
        return jsonify({"message" : "cctv상태 변경완료"})
    except Exception as e:
        db.rollback()
        return jsonify({"error" : str(e)})
    finally:
        cursor.close()
        db.close()

@Admincctv_bp.route("/create_cctv", methods=["POST"])
def create_cctv():
    cctv_lat = request.json['latitude']
    cctv_lng = request.json['longitude']
    cctv_address = request.json['location']
    cctv_status = request.json['status']
    db = db_con()
    cursor = db.cursor()
    try:
        insert_sql = """
        INSERT INTO TB_CCTV (CCTV_LAT, CCTV_LNG, CCTV_LOAD_ADDRESS, CCTV_STATUS)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(insert_sql, (cctv_lat, cctv_lng, cctv_address, cctv_status))
        db.commit()
        return jsonify({"message": "새 CCTV 생성 완료"})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        db.close()
