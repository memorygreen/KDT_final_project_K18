from flask import Blueprint, request, jsonify
from db import db_con

search_missing_bp = Blueprint('SearchMissing', __name__)

@search_missing_bp.route('/SearchMissing', methods=['POST'])
def search_missing():
    try:
        data = request.json  # JSON 형식으로 데이터를 받음
        print("SearchMissing..py 백으로 이동함 ")
        print("넘어온 data" , data)
        
        #세션에 담긴 id 
        session_id = data.get('session_id')
        
        # 인적사항
        missing_name = data.get('missing_name')
        missing_gender = data.get('missing_gender')
        missing_age = int(data.get('missing_age'))
        
        # 나이 구분 하기
        if (missing_age <=9) :
            missing_age_cate = 'child'
        elif(missing_age <=19) :
            missing_age_cate = 'teenager'
        elif(missing_age <=60) :
            missing_age_cate = 'adult'
        else :
            missing_age_cate ='senior'
            
        
        # 실종자 마지막 발견장소
        missing_location = data.get('missing_location')
        missing_location_lat = data.get('missing_location_lat')
        missing_location_lng = data.get('missing_location_lng')
        
        
        missing_img = data.get('missing_img_url')
        
        selected_top = data.get('selected_top')
        selected_top_color = data.get('selected_top_color')
        selected_bottom = data.get('selected_bottom')
        selected_bottom_color = data.get('selected_bottom_color')
        selected_belongings = data.get('selected_belongings')
        
        selected_top_kor = data.get('selected_top_kor')
        selected_top_color_kor = data.get('selected_top_color_kor')
        selected_bottom_kor = data.get('selected_bottom_kor')
        selected_bottom_color_kor = data.get('selected_bottom_color_kor')
        selected_belongings_kor = data.get('selected_belongings_kor')
        
        missing_clothes_etc = data.get('missing_clothes_etc')
        missing_belongings_etc = data.get('missing_belongings_etc')
        
        
        # 값들을 콘솔창에 프린트
        print('백에서 값 넘어오는지 확인')
        print(f"missing_name: {missing_name}")
        print(f"missing_age: {missing_age}")
        print(f"missing_age(구분한 값): {missing_age_cate}")
        print(f"missing_gender: {missing_gender}")
        
        print(f"missing_location: {missing_location}")
        print(f"missing_location_lat: {missing_location_lat}")
        print(f"missing_location_lng: {missing_location_lng}")
        print(f"image_url: {missing_img}")
        
        print(f"selected_top: {selected_top}")
        print(f"selected_top_color: {selected_top_color}")
        print(f"selected_bottom: {selected_bottom}")
        print(f"selected_bottom_color: {selected_bottom_color}")
        print(f"selected_belongings: {selected_belongings}")
        
        print(f"selected_top_kor: {selected_top_kor}")
        print(f"selected_top_color_kor: {selected_top_color_kor}")
        print(f"selected_bottom_kor: {selected_bottom_kor}")
        print(f"selected_bottom_color_kor: {selected_bottom_color_kor}")
        print(f"selected_belongings: {selected_belongings_kor}")
        
        print(f"missing_clothes_etc: {missing_clothes_etc}")
        print(f"missing_belongings_etc: {missing_belongings_etc}")
        
        
        # 사용자한테 문자열로 입력받은 missing_location을 위도, 경도로 변환하여 변수에 저장
        # missing_location_lat, missing_location_lon = geocoders.get_lat_lon(missing_location)
        # print(missing_location_lat, missing_location_lon)
        
        print('확인용)데이터베이스 연결 전')
        
        
        # 데이터베이스 연결
        conn = db_con()
        cursor = conn.cursor()

        print('확인용)데이터베이스 연결 후')
        
        
        # TB_MISSING 테이블에 데이터 삽입
        sql_missing = """
        INSERT INTO TB_MISSING (USER_ID, MISSING_NAME, MISSING_GENDER,MISSING_AGE, MISSING_AGE_CATE, 
                                MISSING_IMG, MISSING_LOCATION_LAT, MISSING_LOCATION_LON, MISSING_LOCATION)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s,  %s)
        """
        cursor.execute(sql_missing, (session_id, missing_name, missing_gender,missing_age,  missing_age_cate, missing_img, missing_location_lat, missing_location_lng, missing_location))

        missing_id = cursor.lastrowid
        print('확인용)실종자 테이블 삽입 후')
        
        
        # TB_MISSING_CLOTHES 테이블에 데이터 삽입
        sql_clothes = """
        INSERT INTO TB_MISSING_CLOTHES (MISSING_IDX, MISSING_TOP, MISSING_TOP_COLOR, MISSING_BOTTOMS, MISSING_BOTTOMS_COLOR, 
                                        MISSING_TOP_KOR, MISSING_TOP_COLOR_KOR, MISSING_BOTTOMS_KOR, MISSING_BOTTOMS_COLOR_KOR, MISSING_CLOTHES_ETC )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql_clothes, (missing_id, selected_top, selected_top_color, selected_bottom, selected_bottom_color, 
                                    selected_top_kor, selected_top_color_kor, selected_bottom_kor, selected_bottom_color_kor, missing_clothes_etc))
        
        print('확인용)실종자 인상착의 테이블 삽입 후')
        
        # TB_BELONGINGS 테이블에 데이터 삽입
        sql_belongings = """
        INSERT INTO TB_BELONGINGS (MISSING_IDX, BELONGINGS_CATE, BELONGINGS_CATE_KOR, BELONGINGS_ETC)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(sql_belongings, (missing_id, selected_belongings, selected_belongings_kor, missing_belongings_etc))

        print('확인용)실종자 소지품 테이블 삽입 후')

        near_cctv(missing_location_lat,missing_location_lng)
        print(near_cctv)
        conn.commit()
        cursor.close()
        conn.close()
        
        print('확인용)연결 끊기 후')

        response = {
            'status': 'success',
            'data': {
                'session_id' : session_id,
                
                'missing_name': missing_name,
                'missing_age': missing_age_cate,
                'missing_gender': missing_gender,
                
                'missing_location': missing_location,
                'missing_location_lat': missing_location_lat,
                'missing_location_lng': missing_location_lng,
                
                'image_url': missing_img,
                
                'selected_top': selected_top,
                'selected_top_color': selected_top_color,
                'selected_bottom': selected_bottom,
                'selected_bottom_color': selected_bottom_color,
                'selected_belongings': selected_belongings,
                
                'selected_top_kor': selected_top_kor,
                'selected_top_color_kor': selected_top_color_kor,
                'selected_bottom_kor': selected_bottom_kor,
                'selected_bottom_color_kor': selected_bottom_color_kor,
                'selected_belongings_kor': selected_belongings_kor
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
    
def near_cctv(missing_location_lat, missing_location_lng):
    try:
        # /CCTVLocation 엔드포인트에 GET 요청하여 모든 CCTV의 정보를 가져옴
        cctv_locations = request.get('/CCTVLocation').json()
        
        # 최초 거리를 무한대로 설정하여 초기화
        min_distance = float('inf')
        nearest_cctv = None
        
        # 모든 CCTV의 정보를 반복하며 입력된 위치와의 거리를 계산하여 가장 가까운 CCTV를 찾음
        for cctv in cctv_locations:
            cctv_lat = cctv.get('lat')
            cctv_lng = cctv.get('lng')
            
            # 두 점 간의 거리 계산
            distance = calculate_distance(missing_location_lat, missing_location_lng, cctv_lat, cctv_lng)
            
            # 현재까지의 최소 거리보다 더 짧은 거리가 나오면 최소 거리와 가장 가까운 CCTV를 업데이트
            if distance < min_distance:
                min_distance = distance
                nearest_cctv = cctv
        
        return nearest_cctv
        
    except Exception as e:
        # 에러 발생 시 처리
        print("Error occurred while finding nearest CCTV:", str(e))
        return None

# 두 지점 간의 거리를 계산하는 함수
def calculate_distance(lat1, lon1, lat2, lon2):
    from math import sin, cos, sqrt, atan2, radians

    # 지구의 반지름 (미터)
    R = 6373.0

    # 라디안으로 변환
    lat1 = radians(lat1)
    lon1 = radians(lon1)
    lat2 = radians(lat2)
    lon2 = radians(lon2)

    # 위도 및 경도의 차이 계산
    dlon = lon2 - lon1
    dlat = lat2 - lat1

    # 거리를 계산하기 위한 Haversine 공식 적용
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    # 거리 계산
    distance = R * c

    return distance


    
