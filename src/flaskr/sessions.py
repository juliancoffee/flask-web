from . import datawork
from datetime import (
    datetime, timedelta
)
# import datawork
from typing import (
    Dict
)


def get_sessions(session_file: str) -> None:
    return datawork.get_data(session_file)


def save_sessions(session_file: str, sessions: Dict) -> None:
    datawork.update_data(session_file, sessions)


def add_session(sessions, session):
    sessions.update(session)


def create_session(login, token, days=1):
    current_time = datetime.now()
    expires = current_time + timedelta(days=days)

    return {
        token: {
            "login": login,
            "expires": {
                "year": f"{expires.year}",
                "month": f"{expires.month}",
                "day": f"{expires.day}",
            },
            "valid": True,
        }
    }


def get_expired_time(expires):
    year = int(expires["year"])
    month = int(expires["month"])
    day = int(expires["day"])
    return datetime(year, month, day)


def check_token(token: str, sessions: Dict) -> bool:
    current_time = datetime.now()
    if token not in sessions:
        return False
    else:
        expires_time = get_expired_time(sessions[token]["expires"])
        if (expires_time - current_time).days < 0:
            print(current_time - expires_time)
            return False
        else:
            return True


def get_user(token: str, sessions: Dict):
    if token in sessions:
        return sessions[token]["login"]
    else:
        return None
