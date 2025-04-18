from flask import Blueprint, redirect, url_for, session, request, current_app
from app import oauth
from flask import render_template


main = Blueprint('main', __name__)

@main.route('/login/google')
def login_with_google():
    redirect_uri = url_for('main.google_callback', _external=True)
    print("Redirect URI being sent:", redirect_uri)
    return oauth.google.authorize_redirect(redirect_uri)

@main.route('/auth/google/callback')
def google_callback():
    token = oauth.google.authorize_access_token()
    user_info = oauth.google.userinfo() 
    session['user'] = user_info
    return render_template('dashboard.html', user=user_info)

# @main.route('/login/google')
# def login_with_google():
#     redirect_uri = url_for('main.google_callback', _external=True)
#     next_url = request.args.get('next', '')
#     return oauth.google.authorize_redirect(redirect_uri + f'?next={next_url}')


# @main.route('/auth/google/callback')
# def google_callback():
#     token = oauth.google.authorize_access_token()
#     user_info = oauth.google.userinfo()
#     session['user'] = user_info

#     # Redirect to 'next' if exists
#     next_url = request.args.get('next')
#     return redirect(next_url or url_for('main.settings'))


# @main.route('/settings')
# def settings():
#     if 'user' not in session:
#         return redirect(url_for('main.login_with_google', next=request.path))
    
#     user = session['user']
#     return render_template('dashboard.html', user=user)