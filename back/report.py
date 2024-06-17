from db import db_con
from flask import Blueprint, request, jsonify, Response
import json
import time

report_bp = Blueprint('report', __name__)
clients = []

# 실종자 알림 제보 및 유저 알람 체크 0으로 변경


@report_bp.route('/report', methods=['POST'])
def report_missing_person():
    if request.method == 'POST':
        try:
            # Connect to the database
            db = db_con()
            cursor = db.cursor()
            print(request.json)
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
            # Get the USER_ID of the user who posted the poster
            select_user_query = """
                SELECT USER_ID 
                FROM TB_POSTER 
                JOIN TB_MISSING ON TB_POSTER.MISSING_IDX = TB_MISSING.MISSING_IDX 
                WHERE POSTER_IDX = %s
            """
            cursor.execute(select_user_query, (POSTER_IDX,))
            result = cursor.fetchone()

            if result:
                USER_ID = result[0]

                # Update the USER_ALARM_CK to 0 for the user
                update_alarm_query = "UPDATE TB_USER SET USER_ALARM_CK = 0 WHERE USER_ID = %s AND USER_ALARM_CK=1"
                cursor.execute(update_alarm_query, (USER_ID,))
                # Commit changes
                db.commit()

            # Close cursor and database connection
            cursor.close()
            db.close()

            return jsonify({"message": "Report submitted successfully"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

#  알람 변동 클릭시 USER_ALARM_CK 1로 (확인상태 )변경


@report_bp.route('/updateAlarm', methods=['POST'])
def update_alarm():
    try:
        user_id = request.json.get('user_id')

        db = db_con()
        cursor = db.cursor()

        update_query = "UPDATE TB_USER SET USER_ALARM_CK = 1 WHERE USER_ID = %s"
        cursor.execute(update_query, (user_id,))
        db.commit()

        cursor.close()
        db.close()

        return jsonify({"message": "Alarm status updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 제보 받은 알람 목록 보기
@report_bp.route('/my_report', methods=['POST'])
def my_notification():
    data = request.get_json()
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({'error': 'User is not logged in'}), 401

    db = db_con()
    cursor = db.cursor()

    sql_my_report = """
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

# 안읽은 제보 알람보기


@report_bp.route('/my_no_report', methods=['POST'])
def my_no_notification():
    data = request.get_json()
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({'error': 'User is not logged in'}), 401

    db = db_con()
    cursor = db.cursor()

    sql_my_report = """
    SELECT r.REPORT_ID, r.POSTER_IDX, m.MISSING_IDX, m.MISSING_NAME, r.REPORT_TIME, r.REPORT_SIGHTING_TIME, r.REPORT_SIGHTING_PLACE, r.REPORT_ETC, r.REPORT_NOTIFICATION, r.REPORT_CK_TIME
    FROM TB_REPORT r
    JOIN TB_POSTER p ON r.POSTER_IDX = p.POSTER_IDX
    JOIN TB_MISSING m ON p.MISSING_IDX = m.MISSING_IDX
    WHERE m.USER_ID = %s AND r.REPORT_NOTIFICATION=0
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


# 제보 조회 및  확인
@report_bp.route('/report_detail', methods=['POST'])
def report_detail():
    try:
        report_id = request.json.get('report_id')
        if not report_id:
            return jsonify({"error": "Report ID is missing"}), 400

        db = db_con()
        cursor = db.cursor()

        # 현재 REPORT_NOTIFICATION 값을 확인
        cursor.execute(
            "SELECT REPORT_NOTIFICATION FROM TB_REPORT WHERE REPORT_ID = %s", (report_id,))
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


# cctv 캡처 알람
@report_bp.route('/my_capture', methods=['POST'])
def my_capture():
    data = request.get_json()
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({'error': 'User is not logged in'}), 401

    db = db_con()
    cursor = db.cursor()

    sql_my_capture = """
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


# cctv 캡처 알람
@report_bp.route('/my_no_capture', methods=['POST'])
def my_no_capture():
    data = request.get_json()
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({'error': 'User is not logged in'}), 401

    db = db_con()
    cursor = db.cursor()

    sql_my_capture = """
    SELECT c.CAPTURE_IDX, m.MISSING_IDX, m.MISSING_NAME, c.CCTV_IDX, c.CAPTURE_FIRST_TIME, c.CAPTURE_PATH, c.CAPTURE_ALARM_CK, c.CAPTURE_ALARM_CK_TIME
    FROM TB_CAPTURE c
    JOIN TB_MISSING m ON c.MISSING_IDX = m.MISSING_IDX
    WHERE m.USER_ID = %s AND c.CAPTURE_ALARM_CK=0
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


# 캡처 조회  및 확인
@report_bp.route('/capture_detail', methods=['POST'])
def capture_detail():
    try:
        capture_idx = request.json.get('capture_idx')
        if not capture_idx:
            return jsonify({"error": "capture IDX is missing"}), 400

        db = db_con()
        cursor = db.cursor()

        # 현재  CAPTURE_ALARM_CK값을 확인
        cursor.execute(
            "SELECT CAPTURE_ALARM_CK FROM TB_CAPTURE WHERE CAPTURE_IDX = %s", (capture_idx,))
        current_notification = cursor.fetchone()

        if current_notification and current_notification[0] == 0:
            # CAPTURE_ALARM_CK 가 0인 경우에만 업데이트
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


# 안읽은 알람 수 확인
@report_bp.route('/count_notification', methods=['POST'])
def count_notification():

    try:
        user_id = request.json.get('user_id')
        db = db_con()
        cursor = db.cursor()
        print(user_id)
        report_notification_count = """
            SELECT COUNT(*)
            FROM TB_REPORT R
            JOIN TB_POSTER P ON R.POSTER_IDX = P.POSTER_IDX
            JOIN TB_MISSING M ON P.MISSING_IDX = M.MISSING_IDX
            WHERE M.USER_ID = %s AND R.REPORT_NOTIFICATION = 0
        """
        cursor.execute(report_notification_count, (user_id,))
        report_notification_count = cursor.fetchone()[0]
        print(report_notification_count)
        # 미확인 캡쳐 알람 수 가져오기
        capture_alarm_count = """
            SELECT COUNT(*)
            FROM TB_CAPTURE C
            JOIN TB_MISSING M ON C.MISSING_IDX = M.MISSING_IDX
            WHERE M.USER_ID = %s AND C.CAPTURE_ALARM_CK = 0
        """
        cursor.execute(capture_alarm_count, (user_id,))
        capture_alarm_count = cursor.fetchone()[0]
        print(capture_alarm_count)
        # 총 미확인 알림 수 계산
        total_unread_notifications = report_notification_count + capture_alarm_count
        print(total_unread_notifications)
        cursor.close()
        db.close()
        return jsonify({
            "unread_notifications": total_unread_notifications
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 한명의 실종자의 report 가져오기


@report_bp.route('/one_report', methods=['POST'])
def one_notification():
    data = request.get_json()
    MISSING_IDX = data.get('MISSING_IDX')
    if not MISSING_IDX:
        return jsonify({'error': 'MISSING_IDX is missing'}), 401

    db = db_con()
    cursor = db.cursor()

    sql_my_report = """
    SELECT r.REPORT_ID, r.POSTER_IDX, m.MISSING_IDX, m.MISSING_NAME, r.REPORT_TIME, r.REPORT_SIGHTING_TIME, r.REPORT_SIGHTING_PLACE, r.REPORT_ETC, r.REPORT_NOTIFICATION, r.REPORT_CK_TIME
    FROM TB_REPORT r
    JOIN TB_POSTER p ON r.POSTER_IDX = p.POSTER_IDX
    JOIN TB_MISSING m ON p.MISSING_IDX = m.MISSING_IDX
    WHERE m.MISSING_IDX = %s
    """
    cursor.execute(sql_my_report, (MISSING_IDX,))

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


@report_bp.route('/one_capture', methods=['POST'])
def one_capture():
    data = request.get_json()
    MISSING_IDX = data.get('MISSING_IDX')
    if not MISSING_IDX:
        return jsonify({'error': 'MISSING_IDX is missing'}), 401
    db = db_con()
    cursor = db.cursor()

    sql_my_capture = """
    SELECT c.CAPTURE_IDX, m.MISSING_IDX, m.MISSING_NAME, c.CCTV_IDX, c.CAPTURE_FIRST_TIME, c.CAPTURE_PATH, c.CAPTURE_ALARM_CK, c.CAPTURE_ALARM_CK_TIME
    FROM TB_CAPTURE c
    JOIN TB_MISSING m ON c.MISSING_IDX = m.MISSING_IDX
    WHERE m.MISSING_IDX = %s
    """
    cursor.execute(sql_my_capture, (MISSING_IDX,))

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
