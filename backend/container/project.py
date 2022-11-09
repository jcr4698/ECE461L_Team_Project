from backend.container import hardware_set
import json
from json import JSONEncoder
from types import SimpleNamespace

class Project:

    def __init__(self, id: str, name, description, hw_set1: hardware_set.HWSet, hw_set2: hardware_set.HWSet, auth_users: list):
        self.id = id
        self.name = name
        self.description = description
        self.hw_set1 = hw_set1
        self.hw_set2 = hw_set2
        self.auth_users = auth_users

    def get_id(self):
        return self.id

    def get_hw_sets(self):
        return self.hw_set1, self.hw_set2
    
    def get_auth_users(self):
        return self.auth_users
    
    def set_id(self, id):
        self.id=id

    def set_hw_set1(self, hw1: hardware_set.HWSet):
        self.hw_set1=hw1

    def set_hw_set2(self, hw2: hardware_set.HWSet):
        self.hw_set2=hw2
    
    def set_auth_users(self, users: list):
        self.auth_users=users


class ProjectEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__

def project_to_json(project: Project):
    return json.dumps(project, indent=4, cls=ProjectEncoder)
