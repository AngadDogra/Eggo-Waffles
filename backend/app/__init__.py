# app/__init__.py
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv


class Config:
    load_dotenv()

db = SQLAlchemy()
jwt = JWTManager()
oauth = OAuth()

def create_app():
    template_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../frontend'))
    app = Flask(__name__, template_folder=template_dir, static_folder=template_dir)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    oauth.init_app(app)

    oauth.register(
        name='google',
        client_id=os.getenv("GOOGLE_CLIENT_ID"),
        client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={
            'scope': 'openid email profile'
        },
        redirect_url='http://127.0.0.1:5000/auth/google/callback'
    )

    from app.routes import main
    app.register_blueprint(main)

    return app
