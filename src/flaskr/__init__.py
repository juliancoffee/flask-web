import os

from flask import (
    Flask, render_template
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
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/treasure-map.html')
    def treasure_map():
        return render_template('treasure-map.html')

    @app.route('/treasure-user.html')
    def treasure_user():
        return render_template('treasure-user.html')

    return app
