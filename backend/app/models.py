# app/models.py

from app import db
from werkzeug.security import generate_password_hash, check_password_hash

from sqlalchemy import Column, Integer

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=False)
    email = db.Column(db.String(120), unique=True)
    
    # Add this if it's missing:
    pomodoros_completed = db.Column(db.Integer, default=0)




from datetime import datetime

class PomodoroSession(db.Model):
    __tablename__ = 'pomodoro_sessions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    session_name = db.Column(db.String(100)) 
    pomodoros_completed = db.Column(db.Integer, default=0)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('sessions', lazy=True))