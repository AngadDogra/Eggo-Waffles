# app/routes.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from .models import User, Pomodoro

main = Blueprint('main', __name__) 

users = []

@main.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if any(user.username == username for user in users):
        return jsonify({'msg': 'Username already taken'}), 400

    new_user = User(username=username, password=password)
    users.append(new_user)
    return jsonify({'msg': 'User registered successfully'}), 201

@main.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = next((user for user in users if user.username == username), None)

    if user and user.check_password(password):
        access_token = create_access_token(identity=username)
        return jsonify({'access_token': access_token}), 200

    return jsonify({'msg': 'Invalid credentials'}), 401

@main.route('/pomodoro', methods=['POST'])
@jwt_required()
def save_pomodoro():
    current_user = get_jwt_identity()
    data = request.get_json()
    duration = data.get('duration')

    if duration:
        new_pomodoro = Pomodoro(duration=duration, completed_at=datetime.now())
        user = next(user for user in users if user.username == current_user)
        user.pomodoros.append(new_pomodoro)
        return jsonify({'msg': 'Pomodoro session saved successfully'}), 200

    return jsonify({'msg': 'Duration is required'}), 400

@main.route('/pomodoros', methods=['GET'])
@jwt_required()
def get_pomodoros():
    current_user = get_jwt_identity()
    user = next(user for user in users if user.username == current_user)

    pomodoro_data = [{
        'id': pomodoro.id,
        'duration': pomodoro.duration,
        'completed_at': pomodoro.completed_at.strftime('%Y-%m-%d %H:%M:%S')
    } for pomodoro in user.pomodoros]

    return jsonify(pomodoro_data), 200

@main.route('/')
def hello():
    return "Hello from backend!"


# -------------------------------------------------------

from app import db

from sqlalchemy import text 

# Test route to check database connection
@main.route('/test-db', methods=['GET'])
def test_db_connection():
    try:
        # Wrap the SQL expression in text() to make it valid for SQLAlchemy
        db.session.execute(text('SELECT 1'))
        return jsonify({"msg": "Database connection is successful!"}), 200
    except Exception as e:
        return jsonify({"msg": f"Database connection failed: {str(e)}"}), 500
