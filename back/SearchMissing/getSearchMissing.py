from flask import Blueprint, request, jsonify
from db import db_con

get_search_missing_bp = Blueprint("getSearhMissing", __name__)

# 자영(240607) : 프론트에서 넘겨받은 missing_idx에 해당되는 사람의 인사악의 정보 넘기기


@get_search_missing_bp.route("/getSearchMissing", methods=["POST"])
def get_one_missing():

    try:
        print('getSearchMissing.py로 넘어옴')
        data = request.json  # JSON 형식으로 데이터를 받음
        print("백에서 데이터 수신 확인: ", data)  # 디버깅

        # user id 받아오기
        user_id = data.get('session_id')
        missing_idx = data.get('missing_idx')
        # 세션에 담긴 id
        print("백에서 확인 session_id:", user_id,
              "missing_idx:", missing_idx)  # 디버깅

        # user id 가 등록한 missing 전체 select
        db = db_con()
        cursor = db.cursor()


        missing_sql = """
            SELECT 
                M.MISSING_NAME,
                M.MISSING_GENDER,
                M.MISSING_AGE,
                M.MISSING_IMG,
                M.MISSING_LOCATION_LAT,
                M.MISSING_LOCATION_LON,
                M.MISSING_LOCATION,
                M.MISSING_FINDING,
                MC.MISSING_TOP,
                MC.MISSING_TOP_COLOR,
                MC.MISSING_BOTTOMS,
                MC.MISSING_BOTTOMS_COLOR,
                MC.MISSING_CLOTHES_ETC,
                B.BELONGINGS_CATE,
                B.BELONGINGS_ETC
            FROM 
                TB_MISSING M
            INNER JOIN 
                TB_MISSING_CLOTHES MC ON M.MISSING_IDX = MC.MISSING_IDX
            INNER JOIN 
                TB_BELONGINGS B ON M.MISSING_IDX = B.MISSING_IDX
            WHERE 
                M.USER_ID = %s AND M.MISSING_IDX = %s;
            """


        cursor.execute(missing_sql, (user_id, missing_idx))

        missing_sel = cursor.fetchall()
        print('실행후 가져온 값 ' , missing_sel)

        missing = []
        for i in missing_sel:
            missing.append({
                # "MISSING_IDX": missing_idx,
                # "USER_ID": user_id,
                "MISSING_NAME": i[0],
                "MISSING_GENDER": i[1],
                "MISSING_AGE": i[2],
                "MISSING_IMG": i[3],
                "MISSING_LOCATION_LAT": i[4],
                "MISSING_LOCATION_LON": i[5],
                "MISSING_LOCATION": i[6],
                "MISSING_FINDING": i[7],
                "MISSING_TOP": i[8],
                "MISSING_TOP_COLOR": i[9],
                "MISSING_BOTTOMS": i[10],
                "MISSING_BOTTOMS_COLOR": i[11],
                "MISSING_CLOTHES_ETC": i[12],
                "BELONGINGS_CATE": i[13],
                "BELONGINGS_ETC": i[14]
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
