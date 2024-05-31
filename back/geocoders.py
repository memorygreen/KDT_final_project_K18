from geopy.geocoders import Nominatim
import sys

# geopy 라이브러리를 사용하여 위치를 위도와 경도로 변환하는 함수
def get_lat_lon(location):
    geolocator = Nominatim(user_agent = 'South Korea') # user_agent = 'South Korea'  => 한국어 지원
    try:
        location = geolocator.geocode(location)
        if location:
            return location.latitude, location.longitude
        else:
            print("Location not found")
            return None, None
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return None, None




# # TEST
# # 문자열로 입력받은 MISSING_LOCATION 변수
# MISSING_LOCATION = "스마트인재개발원"

# # MISSING_LOCATION_LAT, MISSING_LOCATION_LON 변수에 위도와 경도 값을 저장
# MISSING_LOCATION_LAT, MISSING_LOCATION_LON = get_lat_lon(MISSING_LOCATION)

# # 결과 출력
# print(f"Location: {MISSING_LOCATION}")
# print(f"Latitude: {MISSING_LOCATION_LAT}")
# print(f"Longitude: {MISSING_LOCATION_LON}")
