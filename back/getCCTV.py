from flask import Blueprint, request, jsonify
import pymysql
from db import db_con

# 자영(240605) CCTV 상세보기 기능

get_CCTV_bp = Blueprint('/getCCTVurl', __name__)

@get_CCTV_bp.route('/getCCTVurl', methods=['POST', 'GET'])
def get_CCTV():
    try:
        
        # axios로 값 받아오기
        data = request.json
        print("백에서 데이터가 잘 넘어왔는지 확인: ", data) #디버그용 
        
        cctv_idx = data.get('cctv_idx') # CCTV 번호 받아오기
        
        print("백에서 데이터가 잘 넘어왔는지 확인: ", cctv_idx) #디버그용 

        # 데이터베이스 연결
        db = db_con()
        cursor = db.cursor(pymysql.cursors.DictCursor)

        # SQL 쿼리 작성
        sql = "SELECT * FROM TB_CCTV WHERE CCTV_IDX = %s"
    
        # 쿼리 실행
        cursor.execute(sql, (cctv_idx))
        
        # 결과 가져오기
        cctv_data = cursor.fetchall()
        print("cctv_data : ", cctv_data) #디버그용 
        
        # 연결 및 커서 닫기
        cursor.close()
        db.close()
        
        # JSON 응답 반환
        return jsonify(cctv_data), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
#캡쳐한 CCTV_LOAD_ADDRESS 가져오기
@get_CCTV_bp.route('/capture_address',methods=['POST'])
def address():
    try:
        
        # axios로 값 받아오기
        data = request.json
        print("백에서 데이터가 잘 넘어왔는지 확인: ", data) #디버그용 
        
        cctv_idx = data.get('cctv_idx') # CCTV 번호 받아오기
        
        print("백에서 데이터가 잘 넘어왔는지 확인: ", cctv_idx) #디버그용 

        # 데이터베이스 연결
        db = db_con()
        cursor = db.cursor(pymysql.cursors.DictCursor)

        # SQL 쿼리 작성
        sql = "SELECT CCTV_LOAD_ADDRESS FROM TB_CCTV WHERE CCTV_IDX = %s"
    
        # 쿼리 실행
        cursor.execute(sql, (cctv_idx,))
        
        # 결과 가져오기
        cctv_data = cursor.fetchone()
        print("cctv_data : ", cctv_data) #디버그용 

        # CCTV_LOAD_ADDRESS 가져오기
        cctv_load_address = cctv_data['CCTV_LOAD_ADDRESS']
        print("CCTV_LOAD_ADDRESS : ", cctv_load_address) #디버그용 

        # 연결 및 커서 닫기
        cursor.close()
        db.close()
        
        # JSON 응답 반환
        return jsonify({'CCTV_LOAD_ADDRESS': cctv_load_address}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
