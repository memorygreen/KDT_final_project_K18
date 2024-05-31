from db import db_con
from flask import Blueprint, request, jsonify

report_bp = Blueprint('report', __name__)

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
