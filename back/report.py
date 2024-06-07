from db import db_con
from flask import Blueprint, request, jsonify

report_bp = Blueprint('report', __name__)

#실종자 알림 제보
@report_bp.route('/report', methods=['POST'])
def report_missing_person():
    if request.method == 'POST':
        try:
            # Connect to the database
            db = db_con()
            cursor = db.cursor()

            # Get data from request
            data = request.json

            # Extract data from JSON
            POSTER_IDX = data.get('POSTER_IDX')
            REPORT_SIGHTING_PLACE = data.get('REPORT_SIGHTING_PLACE')
            REPORT_SIGHTING_TIME = data.get('REPORT_SIGHTING_TIME')
            REPORT_ETC = data.get('REPORT_ETC')

            # Insert data into the database
            insert_query = "INSERT INTO TB_REPORT (POSTER_IDX, REPORT_SIGHTING_PLACE, REPORT_SIGHTING_TIME, REPORT_ETC) VALUES (%s, %s, %s, %s)"
            cursor.execute(insert_query, (POSTER_IDX,
                           REPORT_SIGHTING_PLACE, REPORT_SIGHTING_TIME, REPORT_ETC))

            # Commit changes
            db.commit()

            # Close cursor and database connection
            cursor.close()
            db.close()

            return jsonify({"message": "Report submitted successfully"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500



#제보 받은 알람 목록 보기
@report_bp.route('/my_report', methods=['POST'])
def my_notification():
    data = request.get_json()
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({'error': 'User is not logged in'}), 401

    db = db_con()
    cursor = db.cursor()

    sql_my_report="""
    SELECT `REPORT_ID`
    FROM `TB_REPORT`
    WHERE `POSTER_IDX` IN (
    SELECT `POSTER_IDX`
    FROM `TB_POSTER`
    WHERE `MISSING_IDX` IN (
        SELECT `MISSING_IDX`
        FROM `TB_MISSING`
        WHERE `USER_ID` = %s
        )
    );
    """
    cursor.execute(sql_my_report, (user_id))

    reports = cursor.fetchall()

    result = []
    for report in reports:
        report_id = report[0]

    # 포스터 제보 정보 가져오기
        sql_poster_notification = """
        SELECT * 
        FROM TB_REPORT 
        WHERE REPORT_ID=%s
        """
        cursor.execute(sql_poster_notification,(report_id))
        poster = cursor.fetchone()

        if poster:
            report_info = {
                'REPORT_ID': poster[0],
                'POSTER_IDX': poster[1],
                'REPORT_TIME': poster[2].strftime('%Y-%m-%d %H:%M:%S'),
                'REPORT_SIGHTING_TIME': poster[3].strftime('%Y-%m-%d %H:%M:%S'),
                'REPORT_SIGHTING_PLACE': poster[4],
                'REPORT_ETC': poster[5],
                'REPORT_NOTIFICATION': poster[6],
                'REPORT_CK_TIME': poster[7],
            }
            result.append(report_info)

    cursor.close()
    db.close()

    return jsonify(result), 200


# 제보 조회 및  확인
@report_bp.route('/report_detail',methods=['POST'])
def report_detail():
    try:
        report_id = request.json.get('report_id')
        if not report_id:
            return jsonify({"error": "Report ID is missing"}), 400
        
        db = db_con()
        cursor = db.cursor()

        # 현재 REPORT_NOTIFICATION 값을 확인
        cursor.execute("SELECT REPORT_NOTIFICATION FROM TB_REPORT WHERE REPORT_ID = %s", (report_id,))
        current_notification = cursor.fetchone()

        if current_notification and current_notification[0] == 0:
            # REPORT_NOTIFICATION이 0인 경우에만 업데이트
            sql_report_update = """
            UPDATE TB_REPORT
            SET REPORT_NOTIFICATION = 1, REPORT_CK_TIME = NOW()
            WHERE REPORT_ID = %s
            """
            cursor.execute(sql_report_update, (report_id,))
            db.commit()
        
        cursor.close()
        db.close()

        return jsonify({"message": "Report updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


#cctv 캡처 알람
@report_bp.route('/my_capture',methods=['POST'])
def my_capture():
    data = request.get_json()
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({'error': 'User is not logged in'}), 401

    db = db_con()
    cursor = db.cursor()

    sql_my_capture="""
    SELECT `CAPTURE_IDX`
    FROM `TB_CAPTURE`
    WHERE `MISSING_IDX` IN(
    SELECT `MISSING_IDX`
    FROM `TB_MISSING`
    WHERE `USER_ID` = %s
    );
    
    """
    cursor.execute(sql_my_capture, (user_id,))

    captures = cursor.fetchall()

    cresult = []
    for capture in captures:
        capture_idx = capture[0]

    # 캡처정보 
        sql_capture_notification = """
        SELECT * 
        FROM TB_CAPTURE
        WHERE CAPTURE_IDX=%s
        """
        cursor.execute(sql_capture_notification,(capture_idx,))
        cpt = cursor.fetchone()

        if cpt:
            report_info = {
                'CAPTURE_IDX': cpt[0],
                'MISSING_IDX': cpt[1],
                'CCTV_IDX': cpt[2],
                'CAPTURE_FIRST_TIME': cpt[3].strftime('%Y-%m-%d %H:%M:%S'),
                'CAPTURE_PATH': cpt[4],
                'CAPTURE_ALARM_CK': cpt[5],
                'CAPTURE_ALARM_CK_TIME': cpt[6],
            }
            cresult.append(report_info)

    cursor.close()
    db.close()

    return jsonify(cresult), 200


# 캡처 조회  및 확인
@report_bp.route('/capture_detail',methods=['POST'])
def capture_detail():
    try:
        capture_idx = request.json.get('capture_idx')
        if not capture_idx:
            return jsonify({"error": "capture IDX is missing"}), 400
        
        db = db_con()
        cursor = db.cursor()

        # 현재  CAPTURE_ALARM_CK값을 확인
        cursor.execute("SELECT CAPTURE_ALARM_CK FROM TB_CAPTURE WHERE CAPTURE_IDX = %s", (capture_idx,))
        current_notification = cursor.fetchone()

        if current_notification and current_notification[0] == 0:
            # REPORT_NOTIFICATION이 0인 경우에만 업데이트
            sql_capture_update = """
            UPDATE TB_CAPTURE
            SET CAPTURE_ALARM_CK = 1, CAPTURE_ALARM_CK_TIME = NOW()
            WHERE CAPTURE_IDX = %s
            """
            cursor.execute(sql_capture_update, (capture_idx,))
            db.commit()
        
        cursor.close()
        db.close()

        return jsonify({"message": "capture updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



    
    


   




        
