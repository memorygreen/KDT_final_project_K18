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



#제보 받은 알람 확인
@report_bp.route('/my_report', methods=['GET', 'POST'])
def my_notification():
    if request.method == 'POST':
        user_id = request.json.get('user_id')
        if not user_id:
            return jsonify({'error': 'User is not logged in'}), 401
        db=db_con()
        cursor=db.cursor()

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
            poster_idx = report[0]

             # 포스터 제보 정보 가져오기
            sql_poster_notification = "SELECT REPORT_SIGHTING_TIME,REPORT_SIGHTING_PLACE,REPORT_ETC FROM TB_REPORT WHERE =%s"
            cursor.execute(sql_poster_notification,(poster_idx))
            poster = cursor.fetchone()

            report_info = {
                'REPORT_ID': report[0],
                'POSTER_IDX': report[1],
                'REPORT_TIME': report[2],
                'REPORT_SIGHTING_TIME': report[3],
                'REPORT_SIGHTING_PLACE': report[4],
                'REPORT_ETC': report[5],
                'REPORT_NOTIFICATION': report[6],
                'REPORT_CK_TIME': report[7],
                } 
            result.append(report_info)

        cursor.close()
        db.close()

        return jsonify(result)
    else:
        # GET 요청의 처리
        # GET 요청에 대한 처리를 추가하거나, POST 요청만 허용하도록 변경합니다.
        return jsonify({'error': 'GET method not allowed'}), 405




        
