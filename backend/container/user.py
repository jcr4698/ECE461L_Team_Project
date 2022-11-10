from backend import encrypt
from json import JSONEncoder
import json

class User():

    def __init__(self, userId, username, password, encrpytify: bool):
        self.userId = userId
        self.username = username
        if encrpytify:
            self._password = encrypt.encrypt(password, 1, 6)
        else:
            self._password = password


    def set_user_id(self, userId):
        self.userId = userId
    def get_user_id(self):
        return self.userId

    def set_user_name(self, username):
        self.username = username
    def get_user_name(self):
        return self.username

    def set_password(self, password):
        self._password = password
    def get_password(self):
        return self._password


class UserEncoder(JSONEncoder):
	def default(self, o):
		return o.__dict__

def user_to_json(user: User):
	return json.dumps(user, indent=4, cls=UserEncoder)