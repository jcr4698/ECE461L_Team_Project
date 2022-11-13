from json import JSONEncoder
import json

class User():

    def __init__(self, userId, username, password, encrpytify: bool):
        self.userId = userId
        self.username = username
        if encrpytify:
            self._password = encrypt(password, 6, 1)
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
    def decrypt_password(password):
        return encrypt(password, 6, -1)
    


class UserEncoder(JSONEncoder):
	def default(self, o):
		return o.__dict__

def user_to_json(user: User):
	return json.dumps(user, indent=4, cls=UserEncoder)


""" INPUTTEXT is the message to be encrypted.
    Shift characters N values in direction D
    left for -1 and right for +1. """
def encrypt(inputText, n, d):
    return _reverse_chars(_shift_chars(inputText, d*n))

""" Shift the characters from INPUTTEXT by N characters
    (N > 1). """
def _shift_chars(inputText, n):
    cipherText = ""
    for c in inputText:
        cipherText += chr(((ord(c) + n - 34) % 93) + 34)
    return cipherText

""" Reverse the order of the characters from INPUTTEXT. """
def _reverse_chars(inputText):
    reversedText = ""
    for c in inputText:
        reversedText = c + reversedText
    return reversedText