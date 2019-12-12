import os
import json
from . import datawork

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

    @app.route('/treasure-login/<action>/index.html')
    @app.route('/index.html')
    @app.route('/', methods=['GET', 'POST'])
    def index(action=""):
        data = datawork.get_data("posts.json")
        users = datawork.get_data("users.json")
        if request.method == 'POST':
            record = request.get_json()
            for user in users:
                if record["user"] == user["name"]:
                    record["user"] == int(record["count"]) + 1
            data.append(record)
            datawork.update_data("posts.json", data)

            return "Taken, ok"
        else:
            data.reverse()
            return render_template('index.html', posts=data)

    return app


app = create_app()


@app.route('/treasure-user.html')
def treasure_user():
    islogged = request.cookies.get('islogged')
    return render_template('treasure-user.html', logged=islogged)


@app.route('/treasure-login/<action>/')
def login_handler(action):
    if action == "login":
        return render_template('treasure-login.html', registered="Yes")
    elif action == "register":
        return render_template('treasure-login.html', registered="no")
    else:
        return "Error"


@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        form = request.get_json()

        hash_password = generate_password_hash(form["password"])
        new_record = {
            "user": form["username"],
            "hash": hash_password,
            "dog": form["dogname"],
            "name": form["name"],
            "count_post": 0,
        }

        data = datawork.get_data("users.json")
        data.append(new_record)
        datawork.update_data("users.json", data)

        resp = make_response("Ok")
        resp.set_cookie("isregistered", "Yes")
        return resp


@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        users = datawork.get_data("users.json")
        form = request.get_json()

        username = form["username"]
        password = form["password"]
        for user in users:
            if user["user"] == username:
                hash_password = user["hash"]
            logged_user = user

        correct = check_password_hash(hash_password, password)
        if correct:
            resp = make_response(logged_user)
            resp.set_cookie("user", user["user"])
            resp.set_cookie("islogged", "Yes")
        else:
            resp = make_response("err")
        return resp


@app.route('/treasure-login/<action>/treasure-map.html')
@app.route('/treasure-map.html')
def treasure_map(action=""):
    return render_template('treasure-map.html')


@app.route('/api/posts')
def api():
    user = request.cookies.get('user')
    if user == "admin":
        data = datawork.get_data("posts.json")
        return json.dumps(data, indent=4)
    return user + " is not admin"


@app.route('/api/users')
def getusers():
    user = request.cookies.get('user')
    if user == "admin":
        data = datawork.get_data("users.json")
        return json.dumps(data, indent=4)
