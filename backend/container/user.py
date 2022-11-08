from json import JSONEncoder
import json


class User():

    def __init__(self, userId, username, password, project_list: list):
        self.userId=userId
        self.username=username
        self.password=password
        self.project_list=project_list


    def set_userId(self, userId):
        self.userId=userId
    def get_userId(self):
        return self.userId

    def set_username(self, username):
        self.username=username
    def get_username(self):
        return self.username

    def set_password(self, password):
        self.password=password
    def get_password(self):
        return self.password

    def set_project_list(self, project_list):
        self.project_list=project_list
    def get_project_list(self):
        return self.project_list

class UserEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__

def user_to_json(user: User):
    return json.dumps(user, indent=4, cls=UserEncoder)