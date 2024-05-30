from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, JWTManager
import pymysql
from db import db_con

login_bp = Blueprint('login', __name__)
bcrypt = Bcrypt()

@login_bp.route('/login', methods=['POST'])
def login_route():
    data = request.get_json()
    username = data.get('id')
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Missing username or password"}), 400

    if login_user(username, password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Bad username or password"}), 401

def login_user(username, password):
    with db_con() as conn:
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT * FROM TB_USER WHERE USER_ID = %s", (username,))
        user = cursor.fetchone()
        if user and bcrypt.check_password_hash(user['USER_PW'], password):
            return True
        else:
            return False

def init_app(app):
    bcrypt.init_app(app)
    jwt = JWTManager(app)
    app.register_blueprint(login_bp)
