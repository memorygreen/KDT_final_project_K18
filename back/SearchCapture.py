from flask import Blueprint, request, jsonify
from db import db_con

SearchCapture_bp = Blueprint('SearchCapture', __name__)

@SearchCapture_bp.route('/get_user_captures', methods=['POST'])
def get_user_captures():
    db = db_con()
    cursor = db.cursor()
    data = request.json
    user_id = data['user_id']
    
    query = """
    SELECT c.CAPTURE_IDX, c.MISSING_IDX, c.CCTV_IDX, c.CAPTURE_FIRST_TIME, 
           c.CAPTURE_PATH, c.CAPTURE_ALARM_CK, c.CAPTURE_ALARM_CK_TIME,
           m.MISSING_NAME, m.MISSING_GENDER, m.MISSING_AGE_CATE, m.MISSING_IMG,
           m.MISSING_LOCATION_LAT, m.MISSING_LOCATION_LON, m.MISSING_FINDING, m.MISSING_LOCATION
    FROM TB_CAPTURE c
    JOIN TB_MISSING m ON c.MISSING_IDX = m.MISSING_IDX
    WHERE m.USER_ID = %s
    """
    
    cursor.execute(query, (user_id,))
    captures = cursor.fetchall()
    cursor.close()
    db.close()
    
    return jsonify(captures)


@SearchCapture_bp.route('/get_captures_by_missing', methods=['POST'])
def get_captures_by_missing():
    db = db_con()
    cursor = db.cursor()
    data = request.json
    missing_id = data['missing_id']
    
    query = """
    SELECT c.CAPTURE_IDX, c.MISSING_IDX, c.CCTV_IDX, c.CAPTURE_FIRST_TIME, 
           c.CAPTURE_PATH, c.CAPTURE_ALARM_CK, c.CAPTURE_ALARM_CK_TIME
    FROM CAPTURE c
    WHERE c.MISSING_IDX = %s
    """
    
    cursor.execute(query, (missing_id,))
    captures = cursor.fetchall()
    cursor.close()
    db.close()
    
    return jsonify(captures)