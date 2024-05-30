from db import db_con
import pymysql
from flask import Blueprint, request, jsonify

Admin_bp = Blueprint('Admin', __name__)

@Admin_bp.route('/Admin', methods=['POST'])
def get_user_info():
    db = db_con()
    cursor = db.cursor()
    try:
        user_sql = "SELECT USER_ID, USER_NAME, USER_BRT_DT, USER_GENDER, USER_PHONE, USER_CATE, USER_STATUS FROM TB_USER WHERE USER_ID != 'test1'"
        cursor.execute(user_sql)
        user_sel = cursor.fetchall()
        
        user = []
        for row in user_sel:
            user.append({
                "USER_ID": row[0],
                "USER_NAME": row[1],
                "USER_BRT_DT": row[2],
                "USER_GENDER": row[3],
                "USER_PHONE": row[4],
                "USER_CATE": row[5],
                "USER_STATUS": row[6]
            })
    finally:
        cursor.close()
        db.close()
    
    return jsonify(user)
