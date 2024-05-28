from db import db_con

#post 작성에 필요한 전체값 가져오기 description
#M = MISSING C=MISSING_CLOTHES B=BELONGINGS
#(M.IDX,USER_ID,M.NAME, M.GENDER, M.AGE, M.IMG, M.LAT, M.LON, C.IDX, M.IDX, TOP, TOP_COLOR, BOTTOMS, BOTTOMS_COLOR, M.ETC, B.IDX, M.IDX, B.CATE, B.ETC)
def poster_get(): #
    # 데이터베이스 연결 가져오기
    db = db_con()
    cursor = db.cursor()

    # MISSING_IDX 값  받아와야함
    sql = """SELECT * 
    FROM TB_MISSING M INNER JOIN TB_MISSING_CLOTHES C 
    ON M.MISSING_IDX=C.MISSING_IDX INNER JOIN TB_BELONGINGS B
    ON M.MISSING_IDX=B.MISSING_IDX 
    AND M.MISSING_IDX=1""" 
    cursor.execute(sql)
    results = cursor.fetchall()

    # 연결 및 커서 닫기
    cursor.close()
    db.close()
    
    return results

#poster_url 생성형 이미지 url ,poster_idx 값 가져와야함  card:imgSrc
def poster_url():
    db = db_con()
    cursor = db.cursor()

    sql = """SELECT POSTER_IMG_PATH
               FROM TB_POSTER
              WHERE POSTER_IDX=6""" 
    cursor.execute(sql)
    results = cursor.fetchall()

    
    cursor.close()
    db.close()
    
    return results

#실종자 이름     card.js : title
def poster_name():
    db = db_con()
    cursor = db.cursor()

    sql = """SELECT MISSING_NAME
               FROM TB_MISSING
              WHERE MISSING_IDX=1""" 
    cursor.execute(sql)
    results = cursor.fetchall()

    
    cursor.close()
    db.close()
    
    return results


def post_create():
    db = db_con()
    cursor = db.cursor()

    sql=""" """
    cursor.execute(sql)
    results = cursor.fetchall()

    cursor.close()
    db.close()

    return results

def post_update():
    db = db_con()
    cursor = db.cursor()

    sql = """
    """
    
    cursor.execute(sql)
    results = cursor.fetchall()

    cursor.close()
    db.close()
    
    return results

#예제 함수 호출 및 결과 출력

#전체
# if __name__ == '__main__':
#    data = poster_get()
#    for row in data:
#        print(row)

#url
# if __name__ == '__main__':
#     data = poster_url()
#     for row in data:
#         print(row)

#이름
if __name__ == '__main__':
    data = poster_name()
    for row in data:
        print(row)





