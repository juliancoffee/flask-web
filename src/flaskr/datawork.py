import os

from flask import json


def get_data(datafile):
    root_dir = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(root_dir, "static/data", datafile)
    with open(json_url, "r") as url:
        data = json.load(url)
    return data


def update_data(datafile, data):
    root_dir = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(root_dir, "static/data", datafile)
    with open(json_url, "w") as url:
        url.write(json.dumps(data))
