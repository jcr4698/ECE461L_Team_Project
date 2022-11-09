from backend import encrypt
import json
from json import JSONEncoder

class User:

	def __init__(self, user_id: str, user_name: str, password: str, encrpytify: bool):
		self._user_id = user_id
		self._user_name = user_name
		if encrpytify:
			self._password = encrypt.encrypt(password, 1, 6)
		else:
			self._password = password

	def get_user_id(self):
		return self._user_id

	def get_user_name(self):
		return self._user_name

	def get_password(self):
		return self._password

	def set_password(self, new_password):
		self._password = encrypt(new_password, 1, 6)

class UserEncoder(JSONEncoder):
	def default(self, o):
		return o.__dict__

def user_to_json(user: User):
	return json.dumps(user, indent=4, cls=UserEncoder)
