from pymongo import MongoClient
import certifi
import json
from backend.container import hardware_set
from backend.container import project
from backend.container import user
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


def access_hwsets():
    client, db=open_connection()
    table=db['HW']
    return client, table

def close_connection(client: MongoClient):
    client.close()

def get_all_projects():
    client, table = access_projects()
    projects=table.find()
    close_connection(client)
    return projects

def try_login_user(user_id: str):
    # access account in database
    client, table = access_accounts()
    user_data = table.find({"_user_id": user_id})

    # extract information from user data
    extracted_user_info = list(user_data)

    # check if user id exists in database
    if len(extracted_user_info) == 0:
        close_connection(client)
        return None

    # get user information # NOW PASS IT TO app.py
    user_info = extracted_user_info[0]
    registered_user = user.User(user_info["_user_id"], user_info["_user_name"], user_info["_password"], False)

    # return user information
    close_connection(client)
    return registered_user

def try_register_user(user_id: str, user_name: str, password: str):
    # access account in database
    client, table = access_accounts()
    user_data = table.find({"id": user_id})

    # check if user id exists in database
    if len(list(user_data)) != 0:
        close_connection(client)
        return None

    # create user json
    new_user = user.User(user_id, user_name, password, True)
    new_account = json.loads(user.user_to_json(new_user))

    # store user in database
    table.insert_one(new_account)

    close_connection(client)
    return new_account

def get_projects_by_user_id(user_id):
    # Access projects that user is authorized to use
    client, table = access_projects()
    db_projs = list(table.find({"auth_users": {"$in": [user_id]}}))
    close_connection(client)

    # Put projects in array of project array
    data_projs = []
    data_idx = 0
    for proj in db_projs:
        data_proj = [
                        data_idx,
                        proj["name"],
                        proj["id"],
                        proj['description'],
                        proj["auth_users"],
                        0,
                    ]
        data_projs.append(data_proj)
        data_idx += 1

    return data_projs

def checkout_hw(id: str, hw_set: int, num: int, user: str) -> bool:
    client, table = access_projects()
    proj = table.find({"id":id})
    client, hw = access_hwsets()

    if len(proj) == 0:
        close_connection(client)
        return False

    x = proj[0]

    auth_users= json.loads(x.auth_users)
    if user not in auth_users:
        close_connection(client)
        return False

    if hw_set == '1':
        availability=hw.find({"id": 1})[0].availability
        newVal= {"$set":{"availability": math.max(0, availability-num)}}
    else:
        availability=hw.find({"id": 2})[0].availability
        newVal= {"$set":{"availability": math.max(0, availability-num)}}

    hw.update_one({"id":id}, newVal)

    close_connection(client)
    return True

def checkin_hw(id: str, hw_set: int, num: int, user: str) -> bool:
    client, table = access_projects()
    proj = table.find({"id":id})
    client, hw = access_hwsets()

    if len(proj) == 0:
        close_connection(client)
        return False

    x = proj[0]

    auth_users= json.loads(x.auth_users)
    if user not in auth_users:
        close_connection(client)
        return False

    if hw_set == '1':
        availability=hw.find({"id": 1})[0].availability
        capacity=hw.find({"id":2})[0].capacity
        newVal= {"$set":{"availability": math.min(availability+num, capacity)}}
    else:
        availability=hw.find({"id": 2})[0].availability
        capacity=hw.find({"id":2})[0].capacity
        newVal= {"$set":{"availability": math.min(availability+num, capacity)}}

    hw.update_one({"id":id}, newVal)

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

def add_project(id: str, name: str, description: str, user_list: list) -> bool:
    client, table = access_projects()

    query = {"id": id}
    results = table.find(query)

    project_data = list(results)
    if len(project_data) != 0:
        close_connection(client)
        return False

    proj_def = project.Project(id, name, description, user_list)
    proj_json = json.loads(project.project_to_json(proj_def))

    table.insert_one(proj_json)

    close_connection(client)

    return True
