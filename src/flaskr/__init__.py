import os
from . import datawork
from . import security
from . import sessions

import flask

from flask import (
    Flask, render_template, request, make_response
)

from werkzeug.security import (
    generate_password_hash, check_password_hash
)


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'treasure.sqlite'),
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route('/index.html')
    @app.route('/', methods=['GET', 'POST'])
    def index(action=""):
        posts = datawork.get_data("posts.json")
        users = datawork.get_data("users.json")
        if request.method == 'POST':
            new_post = request.get_json()
            session_list = sessions.get_sessions("sessions.json")

            session_token = new_post["token"]
            if sessions.check_token(session_token, session_list):
                author = sessions.get_user(session_token, session_list)
            else:
                flask.abort(403)
                flask.abort("Token authentification failed")
                return

            users[author]["count_post"] += 1
            datawork.update_data("users.json", users)

            created_post = {
                "topic": users[author]["username"] + ": " + new_post["topic"],
                "content": new_post["content"],
            }
            posts.append(created_post)
            datawork.update_data("posts.json", posts)
            return created_post
        else:
            posts.reverse()
            return render_template('index.html', posts=posts)

    return app


app = create_app()


@app.route('/treasure-user.html')
def treasure_user():
    users = datawork.get_data("users.json")

    islogged = request.cookies.get('islogged')
    session_token = request.cookies.get('token')
    session_list = sessions.get_sessions("sessions.json")
    username = ""
    session = "no"
    if sessions.check_token(session_token, session_list):
        login = sessions.get_user(session_token, session_list)
        username = users[login]["username"]
        session = "Ok"

    resp = make_response(render_template(
        'treasure-user.html',
        logged=islogged if islogged is not None else "no",
        username=username,
        session=session,
    ))
    if session != "Ok":
        resp.set_cookie("islogged", "", expires=0)
        resp.set_cookie("token", "", expires=0)
    return resp


@app.route('/treasure-login/<action>/')
def login_handler(action):
    if action == "login":
        return render_template('treasure-login.html', login=True)
    elif action == "register":
        return render_template('treasure-login.html', login=False)
    else:
        return "Error"


@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        form = request.get_json()
        user_login = form["login"]

        users = datawork.get_data("users.json")
        for user in users:
            if user == user_login:
                print(f"user = {user}\nlogin = {user_login}")
                return "Exists"

        hash_password = generate_password_hash(form["password"])
        new_record = {
            user_login: {
                "hash": hash_password,
                "dogname": form["dogname"],
                "username": form["username"],
                "count_post": 0,
            }
        }

        users.update(new_record)
        datawork.update_data("users.json", users)

        return "Ok"


@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        users = datawork.get_data("users.json")

        form = request.get_json()
        user_login = form["login"]
        password = form["password"]

        logged_user = users.get(user_login)
        if logged_user is None:
            print("User not found")
            return "User not found"
        else:
            hash_password = logged_user["hash"]
            if check_password_hash(hash_password, password):
                resp = make_response("Ok")
                session_token = security.generate_token()
                resp.set_cookie("token", session_token)

                session_list = sessions.get_sessions("sessions.json")
                for _, session in session_list.items():
                    if session["login"] == user_login:
                        session["valid"] = False

                new_session = sessions.create_session(
                    user_login,
                    session_token
                )
                sessions.add_session(session_list, new_session)
                sessions.save_sessions("sessions.json", session_list)

                resp = make_response("Ok")
                resp.set_cookie("token", session_token)
                resp.set_cookie("islogged", "Yes")
                return resp
            else:
                print("Wrong password")
                return "Wrong password"


@app.route('/treasure-map.html', methods=['POST', 'GET'])
def treasure_map(action=""):
    if request.method == 'POST':
        posts = datawork.get_data("posts.json")
        users = datawork.get_data("users.json")
        session_list = sessions.get_sessions("sessions.json")

        new_comment = request.get_json()
        session_token = new_comment["token"]
        if sessions.check_token(session_token, session_list):
            author = sessions.get_user(session_token, session_list)
            topic = f"{users[author]['username']}: Comment"
            content = f"Address: {new_comment['address']}\n" +\
                f"Comment: {new_comment['post']}\n" +\
                f"Rate: {new_comment['rating']}\n"
            new_post = {
                "content": content,
                "topic": topic,
            }
            posts.append(new_post)
            datawork.update_data("posts.json", posts)
            return "ok"
        else:
            flask.abort(403)
    else:
        return render_template('treasure-map.html')


@app.route('/api/posts')
def api():
    session_list = sessions.get_sessions("sessions.json")
    session_token = request.cookies.get('token')
    if sessions.check_token(session_token, session_list):
        login = sessions.get_user(session_token, session_list)
        if login == "admin":
            data = datawork.get_data("posts.json")
            return {"posts": data}
        else:
            return login + " is not admin"
    else:
        return "You are not admin or your session expired"


@app.route('/api/users')
def getusers():
    session_list = sessions.get_sessions("sessions.json")
    session_token = request.cookies.get('token')
    if sessions.check_token(session_token, session_list):
        login = sessions.get_user(session_token, session_list)
        if login == "admin":
            data = datawork.get_data("users.json")
            return data
        else:
            return login + " is not admin"
    else:
        return "You are not admin or your session expired"


@app.route('/quit')
def endsession():
    resp = make_response(render_template('treasure-quit.html'))
    resp.set_cookie("islogged", "", expires=0)
    resp.set_cookie("token", "", expires=0)
    return resp
