from flask import Blueprint, request, jsonify
from db import db_con
import geocoders

search_missing_bp = Blueprint('SearchMissing', __name__)

@search_missing_bp.route('/SearchMissing', methods=['POST'])
def search_missing():
    try:
        data = request.json  # JSON 형식으로 데이터를 받음
        missing_name = data.get('missing_name')
        missing_location = data.get('missing_location')
        selected_top = data.get('selected_top')
        selected_top_color = data.get('selected_top_color')
        selected_bottom = data.get('selected_bottom')
        selected_bottom_color = data.get('selected_bottom_color')
        selected_belongings = data.get('selected_belongings')
        image_url = data.get('image_url')
        missing_gender = data.get('missing_gender')
        missing_age = data.get('missing_age')
        
        # 값들을 콘솔창에 프린트
        print(f"missing_name: {missing_name}")
        print(f"missing_location: {missing_location}")
        print(f"selected_top: {selected_top}")
        print(f"selected_top_color: {selected_top_color}")
        print(f"selected_bottom: {selected_bottom}")
        print(f"selected_bottom_color: {selected_bottom_color}")
        print(f"selected_belongings: {selected_belongings}")
        print(f"missing_gender: {missing_gender}")
        print(f"image_url: {image_url}")
        print(f"missing_age: {missing_age}")
        
        # 사용자한테 문자열로 입력받은 missing_location을 위도, 경도로 변환하여 변수에 저장
        missing_location_lat, missing_location_lon = geocoders.get_lat_lon(missing_location)
        print(missing_location_lat, missing_location_lon)
        
        # 데이터베이스 연결
        conn = db_con()
        cursor = conn.cursor()

        # TB_MISSING 테이블에 데이터 삽입
        sql_missing = """
        INSERT INTO TB_MISSING (USER_ID, MISSING_NAME, MISSING_GENDER, MISSING_AGE, MISSING_IMG, MISSING_LOCATION_LAT, MISSING_LOCATION_LON)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql_missing, ('test1', missing_name, missing_gender, missing_age, image_url, missing_location_lat, missing_location_lon))
        missing_id = cursor.lastrowid

        # TB_MISSING_CLOTHES 테이블에 데이터 삽입
        sql_clothes = """
        INSERT INTO TB_MISSING_CLOTHES (MISSING_IDX, MISSING_TOP, MISSING_TOP_COLOR, MISSING_BOTTOMS, MISSING_BOTTOMS_COLOR)
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(sql_clothes, (missing_id, selected_top, selected_top_color, selected_bottom, selected_bottom_color))

        # TB_BELONGINGS 테이블에 데이터 삽입
        sql_belongings = """
        INSERT INTO TB_BELONGINGS (MISSING_IDX, BELONGINGS_CATE)
        VALUES (%s, %s)
        """
        cursor.execute(sql_belongings, (missing_id, selected_belongings))

        conn.commit()
        cursor.close()
        conn.close()

        response = {
            'status': 'success',
            'data': {
                'missing_name': missing_name,
                'missing_location': missing_location,
                'selected_top': selected_top,
                'selected_top_color': selected_top_color,
                'selected_bottom': selected_bottom,
                'selected_bottom_color': selected_bottom_color,
                'selected_belongings': selected_belongings,
                'image_url': image_url
            }
        }
        return jsonify(response), 200 # DB에 넣는과정 성공시 200 반환

    except Exception as e:
        # 에러 메시지를 상세하게 출력
        print("Error occurred:", str(e))
        response = {
            'status': 'error',
            'message': str(e)
        }
        return jsonify(response), 500
