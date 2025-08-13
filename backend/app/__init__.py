# app/__init__.py
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
from flask_migrate import Migrate
from flask_cors import CORS

class Config:
    load_dotenv()
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres.enjxhfxgblspbocvlnpw:agrima@aws-0-ap-south-1.pooler.supabase.com:5432/postgres'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

db = SQLAlchemy()
jwt = JWTManager()
oauth = OAuth()
migrate = Migrate()

def create_app():
    template_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../frontend'))
    assets_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../assets'))

    app = Flask(__name__, template_folder=template_dir, static_folder=template_dir)

    app.config.from_object(Config)
    CORS(app)

    db.init_app(app)
    jwt.init_app(app)
    oauth.init_app(app)

    migrate.init_app(app, db)


    oauth.register(
        name='google',
        client_id=os.getenv("GOOGLE_CLIENT_ID"),
        client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={
            'scope': 'openid email profile'
        },
        redirect_url='https://angaddogra.pythonanywhere.com/auth/google/callback',
        userinfo_endpoint='https://www.googleapis.com/oauth2/v1/userinfo', 
    )


    from flask import send_from_directory
    
    @app.route('/assets/<path:filename>')
    def assets(filename):
        return send_from_directory(assets_dir, filename)

    # Register blueprints, etc.
    from app.routes import main
    app.register_blueprint(main)

    return app
