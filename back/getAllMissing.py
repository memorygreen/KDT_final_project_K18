from flask import Blueprint, request, jsonify
from db import db_con

get_all_missing_bp = Blueprint("getAllMissing", __name__)

# 자영(240605) 세션에 담긴 userid가 등록한 모든 실종자 가져오기

@get_all_missing_bp.route("/getAllMissing", methods=["POST"])
def get_all_missing():
    
    # user id 받아오기
    
    try:
        print("백으로 넘어오나?????")# 디버깅
        data = request.json  # JSON 형식으로 데이터를 받음
        print("백에서 데이터 받아져오나??", data) # 디버깅

        # 세션에 담긴 id
        user_id = data.get('user_id')
        print("세션 값 받아와지나?", user_id)# 디버깅
        
        # user id 가 등록한 missing 전체 select
        db = db_con()
        cursor = db.cursor()
        
        print("db 연결은 되셨나용 ", db, cursor) # 디버깅
        
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
                C.MISSING_BOTTOMS_COLOR_KOR
            FROM 
                TB_BELONGINGS A
            INNER JOIN 
                TB_MISSING B ON A.MISSING_IDX = B.MISSING_IDX
            INNER JOIN 
                TB_MISSING_CLOTHES C ON A.MISSING_IDX = C.MISSING_IDX
            WHERE 
                B.USER_ID = %s;
            """
        cursor.execute(missing_spl, (user_id))
        
        
        print("실행은 되셨나요") # 디버깅
        
        missing_sel = cursor.fetchall()
        print("select 결과 ", missing_sel) # 디버깅
        
        
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
                "MISSING_BOTTOMS_COLOR_KOR": i[15]
            })
        
        
        print("배열에는 담으셨나요(완)", missing)
        cursor.close()
        db.close()
        
        
        
        return jsonify(missing)
    except Exception as e:
        # 에러 메시지를 상세하게 출력
        print("Error occurred:", str(e))
        response = {
            'status': 'error',
            'message': str(e)
        }
        return jsonify(response), 500
    
