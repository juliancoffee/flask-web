import secrets

from werkzeug.security import generate_password_hash


def rand_id() -> str:
    rand = secrets.randbelow(10**6)
    return "{0:0>6}".format(str(rand))


def token(session_id: str) -> str:
    return generate_password_hash(session_id)


def generate_token() -> str:
    session_id = rand_id()
    return token(session_id)
