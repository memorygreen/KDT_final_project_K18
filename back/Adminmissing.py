from db import db_con
from flask import Blueprint, request, jsonify

Adminmissing_bp = Blueprint("Adminmissing", __name__)

@Adminmissing_bp.route("/Admin_mis", methods=["POST"])
def get_missing():
    db = db_con()
    cursor = db.cursor()
    try:
        missing_spl = """
        SELECT 
            A.BELONGINGS_CATE_KOR, 
            A.BELONGINGS_ETC, 
            B.MISSING_IDX,
            B.USER_ID,
            B.MISSING_NAME,
            B.MISSING_GENDER,
            B.MISSING_AGE,
            B.MISSING_IMG,
            B.MISSING_LOCATION_LAT,
            B.MISSING_LOCATION_LON,
            B.MISSING_FINDING,
            C.MISSING_CLOTHES_ETC, 
            C.MISSING_TOP_KOR, 
            C.MISSING_TOP_COLOR_KOR, 
            C.MISSING_BOTTOMS_KOR, 
            C.MISSING_BOTTOMS_COLOR_KOR,
            D.POSTER_IDX,
            D.POSTER_CREATED_AT,
            D.POSTER_SHOW
        FROM 
            TB_BELONGINGS A
        INNER JOIN 
            TB_MISSING B ON A.MISSING_IDX = B.MISSING_IDX
        INNER JOIN 
            TB_MISSING_CLOTHES C ON A.MISSING_IDX = C.MISSING_IDX
        INNER JOIN 
            TB_POSTER D ON A.MISSING_IDX = D.MISSING_IDX;
        """
        cursor.execute(missing_spl)
        missing_sel = cursor.fetchall()
        missing = []
        for i in missing_sel:
            missing.append({
                "BELONGINGS_CATE_KOR": i[0],
                "BELONGINGS_ETC": i[1],
                "MISSING_IDX": i[2],
                "USER_ID": i[3],
                "MISSING_NAME": i[4],
                "MISSING_GENDER": i[5],
                "MISSING_AGE": i[6],
                "MISSING_IMG": i[7],
                "MISSING_LOCATION_LAT": i[8],
                "MISSING_LOCATION_LON": i[9],
                "MISSING_FINDING": i[10],
                "MISSING_CLOTHES_ETC": i[11],
                "MISSING_TOP_KOR": i[12],
                "MISSING_TOP_COLOR_KOR": i[13],
                "MISSING_BOTTOMS_KOR": i[14],
                "MISSING_BOTTOMS_COLOR_KOR": i[15],
                "POSTER_IDX": i[16],
                "POSTER_CREATED_AT": i[17],
                "POSTER_SHOW": i[18]
            })    
    finally:
        cursor.close()
        db.close()        
    return jsonify(missing)

@Adminmissing_bp.route('/poster_show_change', methods=['POST'])
def change_poster_show():
    data = request.get_json()
    poster_idx = data['poster_idx']
    new_show = data['new_show']
    
    db = db_con()
    cursor = db.cursor()
    try:
        cursor.execute(
            "UPDATE TB_POSTER SET POSTER_SHOW = %s WHERE POSTER_IDX = %s", 
            (new_show, poster_idx)
        )
        db.commit()
        response = {'status': 'success'}
    except Exception as e:
        db.rollback()
        response = {'status': 'error', 'message': str(e)}
    finally:
        cursor.close()
        db.close()
        
    return jsonify(response)

@Adminmissing_bp.route('/missing_finding_change', methods=['POST'])
def change_finding():
    data = request.get_json()
    idx = data['idx']
    user_id = data['user_id']
    newfinding = data['newfinding']
    
    db = db_con()
    cursor = db.cursor()
    try:
        cursor.execute(
            "UPDATE TB_MISSING SET MISSING_FINDING = %s WHERE MISSING_IDX = %s AND USER_ID = %s", 
            (newfinding, idx, user_id)
        )
        db.commit()
        response = {'status': 'success'}
    except Exception as e:
        db.rollback()
        response = {'status': 'error', 'message': str(e)}
    finally:
        cursor.close()
        db.close()
        
    return jsonify(response)
