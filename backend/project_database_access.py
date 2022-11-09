from pymongo import MongoClient
import certifi
import json
from backend.container import hardware_set
from backend.container import project
import math

def open_connection():
    ca = certifi.where()
    host = "mongodb+srv://user366:password366@cluster0.rr3e1jv.mongodb.net/?retryWrites=true&w=majority"
    client = MongoClient(host, tlsCAFile=ca)
    db = client['project_app']
    # table = db['Projects']
    return client, db

def access_projects():
    client, db = open_connection()
    table = db['Projects']
    return client, table

def access_accounts():
    client, db = open_connection()
    table = db['Accounts']
    return client, table

def close_connection(client: MongoClient):
    client.close()

def get_all_projects():
    client, table = access_projects()
    close_connection(client)
    return table.find()

def get_projects_by_user_id(user_id):
    # Access projects that user is authorized to use
    client, table = access_projects()
    db_projs = list(table.find({"auth_users":{"$in":["jcr4698"]}}))
    close_connection(client)

    # Put projects in array of project array
    data_projs = []
    data_idx = 0
    for proj in db_projs:
        hw1 = proj["hw_set1"]
        hw2 = proj["hw_set2"]
        data_proj = [
                        data_idx,
                        proj["name"],
                        proj["id"],
                        proj["auth_users"],
                        0,
                        [
                            [hw1["availability"], hw1["capacity"]],
                            [hw2["availability"], hw2["capacity"]]
                        ]
                    ]
        data_projs.append(data_proj)
        data_idx += 1

    return data_projs

def checkout_hw(id: str, hw_set: int, num: int, user: str) -> bool:
    client, table = access_projects()
    proj = table.find({"id":id})

    if len(proj) == 0:
        close_connection(client)
        return False

    x=proj[0]

    auth_users= json.loads(x.auth_users)
    if user not in auth_users:
        close_connection(client)
        return False

    if hw_set == '1':
        availability=x.hw_set1.availability
        newVal= {"$set":{"hw_set1.availability":math.max(0, availability-num)}}
    else:
        availability=x.hw_set2.availability
        newVal= {"$set":{"hw_set2.availability":math.max(0, availability-num)}}


    table.update_one({"id":id}, newVal)

    close_connection(client)
    return True

def checkin_hw(id: str, hw_set: int, num: int, user: str) -> bool:
    client, table = access_projects()
    proj = table.find({"id":id})

    if len(proj) == 0:
        close_connection(client)
        return False

    x = proj[0]

    auth_users = json.loads(x.auth_users)
    if user not in auth_users:
        close_connection(client)
        return False

    if hw_set == '1':
        capacity = x.hw_set1.capacity
        availability = x.hw_set1.availabilty
        newVal = {"$set":{"hw_set1.availability":math.min(capacity, availability+num)}}

    else:
        capacity = x.hw_set2.capacity
        availability = x.hw_set2.availabilty
        newVal = {"$set":{"hw_set2.availability":math.min(capacity, availability+num)}}

    table.update_one({"id": id}, newVal)

    close_connection(client)
    return True

def join_project(id: str, user: str):
    client, table = access_projects()

    proj = table.find({"id": id})

    if len(proj) == 0:
        close_connection(client)
        return False

    x = proj[0]

    auth_users= json.loads(x.auth_users)
    if user not in auth_users:
        auth_users.append(user)
        table.update_one({"id":id}, {"$set": {"auth_users":auth_users}})    

    close_connection(client)

def leave_project(id: str, user: str):
    client, table = access_projects()

    proj = table.find({"id":id})

    if len(proj) == 0:
        close_connection(client)
        return False

    x = proj[0]

    auth_users= json.loads(x.auth_users)
    if user in auth_users:
        auth_users.remove(user)
        table.update_one({"id":id}, {"$set": {"auth_users":auth_users}})    

    close_connection(client)

def add_project(id: str, name: str, description: str, hw_set_1_qty: int, hw_set_2_qty: int, user_list: list)-> bool:
    client, table = access_projects()

    query = {"id": id}
    results = table.find(query)

    project_data = list(results)
    if len(project_data) != 0:
        close_connection(client)
        return False

    hw_1 = hardware_set.HWSet(hw_set_1_qty)
    hw_2 = hardware_set.HWSet(hw_set_2_qty)

    proj_def = project.Project(id, name, description, hw_1, hw_2, user_list)
    proj_json = json.loads(project.project_to_json(proj_def))

    table.insert_one(proj_json)

    close_connection(client)

    return True

