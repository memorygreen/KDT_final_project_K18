from flask import Blueprint, request, jsonify
from db import db_con

get_search_missing_bp = Blueprint("getSearhMissing", __name__)

# 자영(240607) : 프론트에서 넘겨받은 missing_idx에 해당되는 사람의 인사악의 정보 넘기기

@get_search_missing_bp.route("/getSearhMissing", methods=["POST"])
def get_all_missing():
    
    try:
        print('getSearchMissing.py로 넘어옴')
        data = request.json  # JSON 형식으로 데이터를 받음
        print("백에서 데이터 수신 확인: ", data) # 디버깅

        # user id 받아오기
        user_id = data.get('user_id')
        missing_idx = data.get('missing_idx')
        # 세션에 담긴 id
        print("백에서 확인 session_id:", user_id, "missing_idx:", missing_idx)# 디버깅
        
        # user id 가 등록한 missing 전체 select
        db = db_con()
        cursor = db.cursor()
        
        print("db 연결 확인 : ", db, cursor) # 디버깅
        
        missing_spl = """
            SELECT 
                B.MISSING_IDX,
                B.USER_ID,
                B.MISSING_NAME,
                B.MISSING_GENDER,
                B.MISSING_AGE,
                B.MISSING_IMG,
                B.MISSING_LOCATION_LAT,
                B.MISSING_LOCATION_LON,
                B.MISSING_FINDING,
                C.MISSING_TOP, 
                C.MISSING_TOP_COLOR, 
                C.MISSING_BOTTOMS, 
                C.MISSING_BOTTOMS_COLOR
                C.MISSING_CLOTHES_ETC, 
                A.BELONGINGS_CATE, 
                A.BELONGINGS_ETC, 
            FROM 
                TB_BELONGINGS A
            INNER JOIN 
                TB_MISSING B ON A.MISSING_IDX = B.MISSING_IDX
            INNER JOIN 
                TB_MISSING_CLOTHES C ON A.MISSING_IDX = C.MISSING_IDX
            WHERE 
                B.USER_ID = %s
                AND B.MISSING_IDX = %s
                
            """
        cursor.execute(missing_spl, (user_id, missing_idx))

        missing_sel = cursor.fetchall()
        print("user가 등록한 모든 실종자 select 결과 ", missing_sel) # 디버깅
        
        missing = []
        for i in missing_sel:
            missing.append({
                "MISSING_IDX": i[0],
                "USER_ID": i[1],
                "MISSING_NAME": i[2],
                "MISSING_GENDER": i[3],
                "MISSING_AGE": i[4],
                "MISSING_IMG": i[5],
                "MISSING_LOCATION_LAT": i[6],
                "MISSING_LOCATION_LON": i[7],
                "MISSING_FINDING": i[8],
                "MISSING_TOP": i[9],
                "MISSING_TOP_COLOR": i[10],
                "MISSING_BOTTOMS": i[11],
                "MISSING_BOTTOMS_COLOR": i[12],
                "MISSING_CLOTHES_ETC": i[13],
                "BELONGINGS_CATE": i[14],
                "BELONGINGS_ETC": i[15]
            })

        
        
        print("실종자 관련 정보 missing배열 : ", missing)
        cursor.close()
        db.close()
        
        return jsonify(missing)
    except Exception as e:
        # 에러 메시지를 상세하게 출력
        print("실종자정보 모두 받아오기 실패 (back) Error occurred:", str(e))
        response = {
            'status': 'error',
            'message': str(e)
        }
        return jsonify(response), 500