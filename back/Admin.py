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
                "USER_BRT_DT": row[2].strftime("%Y-%m-%d"),  # 날짜 형식을 'YYYY-MM-DD'로 변환
                "USER_GENDER": row[3],
                "USER_PHONE": row[4],
                "USER_CATE": row[5],
                "USER_STATUS": row[6]
            })
    finally:
        cursor.close()
        db.close()
    
    return jsonify(user)

@Admin_bp.route('/user_status_change', methods=['POST'])
def change_user_status():
    user_id = request.json['userId']
    new_status = request.json['newStatus']
    db = db_con()
    cursor = db.cursor()
    try:
        update_sql = "UPDATE TB_USER SET USER_STATUS = %s WHERE USER_ID = %s"
        cursor.execute(update_sql, (new_status, user_id))
        db.commit()
        return jsonify({"message": "사용자 상태가 변경되었습니다."})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        db.close()

@Admin_bp.route('/user_category_change', methods=['POST'])
def change_user_category():
    user_id = request.json['userId']
    new_category = request.json['newCategory']
    db = db_con()
    cursor = db.cursor()
    try:
        update_sql = "UPDATE TB_USER SET USER_CATE = %s WHERE USER_ID = %s"
        cursor.execute(update_sql, (new_category, user_id))
        db.commit()
        return jsonify({"message": "사용자 회원구분이 변경되었습니다."})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        db.close()
