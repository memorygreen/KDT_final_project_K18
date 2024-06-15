from flask import Blueprint, request, jsonify
from db import db_con

SearchCapture_bp = Blueprint('SearchCapture', __name__)

# 해당 실종자에 맞는 캡처 정보 호출하기 (자영 240613 수정)


@SearchCapture_bp.route('/get_user_captures', methods=['POST'])
def get_user_captures():
    db = db_con()
    cursor = db.cursor()
    data = request.json
    
    session_id = data.get('sessionId')
    
    
    print('실종자 캡처 정보 가져오기 all ')
    query = """
    SELECT 
       c.CAPTURE_IDX, 
       c.MISSING_IDX, 
       c.CCTV_IDX, 
       c.CAPTURE_FIRST_TIME, 
       c.CAPTURE_PATH, 
       c.CAPTURE_ALARM_CK, 
       c.CAPTURE_ALARM_CK_TIME,
           m.MISSING_NAME, 
           m.MISSING_GENDER, 
           m.MISSING_AGE_CATE, 
           m.MISSING_IMG,
           m.MISSING_LOCATION_LAT, 
           m.MISSING_LOCATION_LON, 
           m.MISSING_FINDING, 
           m.MISSING_LOCATION
    FROM TB_CAPTURE c
    JOIN TB_MISSING m ON c.MISSING_IDX = m.MISSING_IDX
    WHERE m.USER_ID = %s
    """

    cursor.execute(query, (session_id,))
    captures = cursor.fetchall()
    captures_dict = [
        {
            "CAPTURE_IDX": capture[0],
            "MISSING_IDX": capture[1],
            "CCTV_IDX": capture[2],
            "CAPTURE_FIRST_TIME": capture[3],
            "CAPTURE_PATH": capture[4],
            "CAPTURE_ALARM_CK": capture[5],
            "CAPTURE_ALARM_CK_TIME": capture[6],
            "MISSING_NAME": capture[7],
            "MISSING_GENDER": capture[8],
            "MISSING_AGE_CATE": capture[9],
            "MISSING_IMG": capture[10],
            "MISSING_LOCATION_LAT": capture[11],
            "MISSING_LOCATION_LON": capture[12],
            "MISSING_FINDING": capture[13],
            "MISSING_LOCATION": capture[14]
        } for capture in captures
    ]
    cursor.close()
    db.close()

    return jsonify(captures_dict)


@SearchCapture_bp.route('/get_captures_by_missing', methods=['POST'])
def get_captures_by_missing():
    db = db_con()
    cursor = db.cursor()
    data = request.json

    missing_id = data['MISSING_IDX']


    query = """
    SELECT c.CAPTURE_IDX, c.MISSING_IDX, c.CCTV_IDX, c.CAPTURE_FIRST_TIME, 
           c.CAPTURE_PATH, c.CAPTURE_ALARM_CK, c.CAPTURE_ALARM_CK_TIME
    FROM TB_CAPTURE c
    WHERE c.MISSING_IDX = %s
    """

    cursor.execute(query, (missing_id,))
    captures = cursor.fetchall()
    captures_dict = [
        {
            "CAPTURE_IDX": capture[0],
            "MISSING_IDX": capture[1],
            "CCTV_IDX": capture[2],
            "CAPTURE_FIRST_TIME": capture[3],
            "CAPTURE_PATH": capture[4],
            "CAPTURE_ALARM_CK": capture[5],
            "CAPTURE_ALARM_CK_TIME": capture[6]
        } for capture in captures
    ]
    cursor.close()
    db.close()

    return jsonify(captures_dict)
