from flask import Blueprint, request, jsonify
from db import db_con

UserDelete_bp = Blueprint('UserDelete', __name__)

@UserDelete_bp.route('/UserDelete', methods = ['POST'])
def UserDelete():
    data = request.get_json()
    db = db_con()