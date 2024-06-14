from flask import Blueprint, request, jsonify
from db import db_con
import requests
import asyncio
import aiohttp
from math import sin, cos, sqrt, atan2, radians
search_missing_bp = Blueprint('SearchMissing', __name__)

cctv_distances_lock = asyncio.Lock()

@search_missing_bp.route('/SearchMissing', methods=['POST'])
async def search_missing():
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
            missing_age_cate ='old'
            
        
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
        

        conn.commit()
        cursor.close()
        conn.close()
        
        print('확인용)연결 끊기 후')
        
        
        
        
        #cctv정보가져오기
        nearest_cctvs_info=await nearest_cctvs(missing_location_lat, missing_location_lng)
        if nearest_cctvs_info:
            await update_nearest_cctvs_to_db(missing_id, nearest_cctvs_info)
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
                'selected_belongings_kor': selected_belongings_kor,

                
            }
        }
        return jsonify(response), 200

    except Exception as e:
        # 에러 메시지를 상세하게 출력
        print("Error occurred:", str(e))
        response = {
            'status': 'error',
            'message': str(e)
        }
        return jsonify(response), 500
    


#CCTV 정보가져오기   
async def fetch_cctv_data(session):
    try:
        async with session.get('http://localhost:5000/CCTVLocation') as response:
            data = await response.json()
            return data
    except aiohttp.ClientError as e:
        print(f"Error occurred during CCTV data fetch: {e}")
        return []
    




#입력한 위치와 가장 가까운 cctv 5개 찾기
async def nearest_cctvs(missing_location_lat, missing_location_lng):
    try:
        async with aiohttp.ClientSession() as session:
            cctv_locations = await fetch_cctv_data(session)
        if not cctv_locations:
            print("No CCTV data fetched.")
            return None
       
        

        # 거리를 기준으로 가장 가까운 5개의 CCTV 정보 선택
        nearest_cctvs = []
        min_distances = []

        for cctv_location in cctv_locations:
            try:
                cctv_lat = float(cctv_location['CCTV_LAT'])
                cctv_lng = float(cctv_location['CCTV_LNG'])
                distance = calculate_distance(missing_location_lat, missing_location_lng, cctv_lat, cctv_lng)
                if len(nearest_cctvs) < 5:
                    nearest_cctvs.append(cctv_location)
                    min_distances.append(distance)
                else:
                    max_distance_index = min_distances.index(max(min_distances))
                    if distance < min_distances[max_distance_index]:
                        nearest_cctvs[max_distance_index] = cctv_location
                        min_distances[max_distance_index] = distance
            except (KeyError, ValueError) as e:
                print(f"Error processing CCTV data: {e}")
                continue

        if nearest_cctvs:
            return nearest_cctvs
        else:
            print("No nearest CCTV found.")
            return None

    except Exception as e:
        print(f"Error occurred while finding nearest CCTV: {e}")
        return None
async def update_nearest_cctvs_to_db(missing_id, nearest_cctvs):
    try:
        # MySQL 데이터베이스 연결
        conn = db_con()
        cursor = conn.cursor()

        # NEAREST_CCTVS 컬럼에 추가할 값 생성
        nearest_cctvs_str = ','.join([str(cctv['CCTV_IDX']) for cctv in nearest_cctvs])

        # TB_MISSING 테이블 업데이트 쿼리 실행
        update_query = f"UPDATE TB_MISSING SET NEAREST_CCTVS = '{nearest_cctvs_str}' WHERE MISSING_IDX = {missing_id}"
        cursor.execute(update_query)
        conn.commit()

        # 연결 종료
        cursor.close()
        conn.close()
        print(f"NEAREST_CCTVS updated successfully for MISSING_ID {missing_id}")

    except Exception as e:
        print(f"Error updating NEAREST_CCTVS: {e}")

# 두 지점 간의 거리를 계산하는 함수
def calculate_distance(lat1, lng1, lat2, lng2):
    R = 6371.0  # 지구 반지름 (킬로미터 단위)
    lat1_rad = radians(lat1)
    lng1_rad = radians(lng1)
    lat2_rad = radians(lat2)
    lng2_rad = radians(lng2)

    dlat = abs(lat2_rad - lat1_rad)
    dlng = abs(lng2_rad - lng1_rad)

    a = sin(dlat / 2)**2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlng / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = R * c

    return distance  







        

    
