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
    SELECT r.REPORT_ID, r.POSTER_IDX, m.MISSING_IDX, m.MISSING_NAME, r.REPORT_TIME, r.REPORT_SIGHTING_TIME, r.REPORT_SIGHTING_PLACE, r.REPORT_ETC, r.REPORT_NOTIFICATION, r.REPORT_CK_TIME
    FROM TB_REPORT r
    JOIN TB_POSTER p ON r.POSTER_IDX = p.POSTER_IDX
    JOIN TB_MISSING m ON p.MISSING_IDX = m.MISSING_IDX
    WHERE m.USER_ID = %s
    """
    cursor.execute(sql_my_report, (user_id,))

    reports = cursor.fetchall()

    result = []
    for report in reports:
        report_info = {
            'REPORT_ID': report[0],
            'POSTER_IDX': report[1],
            'MISSING_IDX': report[2],
            'MISSING_NAME': report[3],
            'REPORT_TIME': report[4].strftime('%Y-%m-%d %H:%M:%S'),
            'REPORT_SIGHTING_TIME': report[5].strftime('%Y-%m-%d %H:%M:%S'),
            'REPORT_SIGHTING_PLACE': report[6],
            'REPORT_ETC': report[7],
            'REPORT_NOTIFICATION': report[8],
            'REPORT_CK_TIME': report[9],
        }
        result.append(report_info)

    cursor.close()
    db.close()

    return jsonify(result), 200
        

    #

        
            


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
    SELECT c.CAPTURE_IDX, m.MISSING_IDX, m.MISSING_NAME, c.CCTV_IDX, c.CAPTURE_FIRST_TIME, c.CAPTURE_PATH, c.CAPTURE_ALARM_CK, c.CAPTURE_ALARM_CK_TIME
    FROM TB_CAPTURE c
    JOIN TB_MISSING m ON c.MISSING_IDX = m.MISSING_IDX
    WHERE m.USER_ID = %s
    """
    cursor.execute(sql_my_capture, (user_id,))

    captures = cursor.fetchall()

    cresult = []
    for capture in captures:
        capture_info = {
            'CAPTURE_IDX': capture[0],
            'MISSING_IDX': capture[1],
            'MISSING_NAME': capture[2],
            'CCTV_IDX': capture[3],
            'CAPTURE_FIRST_TIME': capture[4].strftime('%Y-%m-%d %H:%M:%S'),
            'CAPTURE_PATH': capture[5],
            'CAPTURE_ALARM_CK': capture[6],
            'CAPTURE_ALARM_CK_TIME': capture[7],
        }
        cresult.append(capture_info)

    cursor.close()
    db.close()

    return jsonify(cresult), 200
        
        

    #
            


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



    
    


   




        
