# app/__init__.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
import os

class Config:
    SECRET_KEY=os.environ.get('843a7b16123097c0cdcbf6e720f93cd0d481aa160102a1bd0f2764de9987afb1')
    JWT_SECRET_KEY = os.environ.get('5524d8fdeae1c02d81dbec3f7deac2e641e8f8622214a04401cacde1e5aaa49e') or 'dev_key_here'
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:agrima@db.enjxhfxgblspbocvlnpw.supabase.co:5432/postgres'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)

    from app.routes import main
    app.register_blueprint(main)

    return app
