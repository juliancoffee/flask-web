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
        print(f"\n\n\n\n\n\n{data}\n\n\n\n\n")
        url.write(json.dumps(data))


def get_match(key, value, data):
    for entry in data:
        if entry[key] == value:
            return entry
    else:
        return None
