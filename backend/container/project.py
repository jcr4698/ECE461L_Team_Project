from backend.container import hardware_set
import json
from json import JSONEncoder
from types import SimpleNamespace

class Project:

    def __init__(self, id: str, name, description, auth_users: list):
        self.id = id
        self.name = name
        self.description = description
        self.auth_users = auth_users

    def get_id(self):
        return self.id
    
    def get_auth_users(self):
        return self.auth_users
    
    def set_id(self, id):
        self.id=id

    def set_auth_users(self, users: list):
        self.auth_users=users


class ProjectEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__

def project_to_json(project: Project):
    return json.dumps(project, indent=4, cls=ProjectEncoder)
