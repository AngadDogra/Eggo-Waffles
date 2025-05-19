from flask import Blueprint, redirect, url_for, session, request, current_app
from app import oauth
from flask import render_template
from app.models import User, PomodoroSession
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import jsonify
from flask_jwt_extended import create_access_token 
from flask import session, redirect, url_for
import jwt
import datetime

main = Blueprint('main', __name__)

@main.route('/login/google')
def login_with_google():

    redirect_uri = url_for('main.google_callback', _external=True)
    print("Redirect URI being sent:", redirect_uri)
    return oauth.google.authorize_redirect(redirect_uri)
    


@main.route('/auth/google/callback')
def google_callback():
    token = oauth.google.authorize_access_token()

    # Get user info using Google’s userinfo endpoint
    user_info = oauth.google.userinfo()
    email = user_info.get("email")
    name = user_info.get("name", email)

    if not email:
        return jsonify({"error": "Google login failed. No email returned."}), 400

    # Check if user exists or create new
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(username=name, email=email)
        db.session.add(user)
        db.session.commit()

    # Generate JWT token
    access_token = create_access_token(identity=email)

    # Redirect to frontend with token
    frontend_url = url_for('static', filename='dashboard.html', _external=True)
    return redirect(f"{frontend_url}?token={access_token}")

@main.route('/pomodoro/log', methods=['POST'])
@jwt_required()
def log_pomodoro():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.json
    pomodoros = data.get("pomodoros", 1)
    session_name = data.get("session_name", "Unnamed session")

    # Update overall count
    user.pomodoros_completed += pomodoros

    # Add session
    new_session = PomodoroSession(
        user_id=user.id,
        session_name=session_name,
        pomodoros_completed=pomodoros
    )
    db.session.add(new_session)
    db.session.commit()

    return jsonify({"message": "Pomodoro logged!"})


@main.route('/pomodoro/history', methods=['GET'])
@jwt_required()
def get_history():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    sessions = [
        {
            "session_name": s.session_name,
            "pomodoros": s.pomodoros_completed,
            "timestamp": s.timestamp.isoformat()
        }
        for s in user.sessions
    ]

    return jsonify({
        "user_name": user.username,
        "user_email": user.email,
        "total_completed": user.pomodoros_completed,
        "history": sessions
    })




@main.route('/update_pomodoros', methods=['POST'])
@jwt_required()
def update_pomodoros():
    data = request.get_json()
    count = data.get('completed_count')

    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({'message': 'User not found'}), 404

    user.pomodoros_completed = count
    db.session.commit()

    return jsonify({'message': 'Pomodoro count updated', 'pomodoros_completed': user.pomodoros_completed}), 200