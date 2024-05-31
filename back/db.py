import pymysql
#db 정보 
#gitignore 에 db.py 추가해서 관리필요
def db_con():
    return pymysql.connect(
        host='project-db-cgi.smhrd.com',
        user='campus_23K_AI18_p3_2',
        password='smhrd2',
        db='campus_23K_AI18_p3_2',
        port=3307,
        charset='utf8'
    )
