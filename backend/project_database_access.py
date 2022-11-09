from pymongo import MongoClient
<<<<<<< HEAD
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
=======
import container.project, container.hardware_set
import json
import math
import user_database_access

def open_connection():
    client=MongoClient("mongodb+srv://user:1234@cluster0.gdxcywm.mongodb.net/?retryWrites=true&w=majority")
    db=client['project_app']
    table=db['Projects']
    return client, table

>>>>>>> main

def close_connection(client: MongoClient):
    client.close()

def get_all_projects():
<<<<<<< HEAD
    client, table = access_projects()
    close_connection(client)
    return table.find()

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
    return registered_user

def try_register_user(user_id: str, user_name: str, password: str):
    # access account in database
    client, table = access_accounts()
    user_data = table.find({"id": user_id})

    # check if user id exists in database
    if len(list(user_data)) != 0:
        close_connection(client)
        return False

    # create user json
    new_user = user.User(user_id, user_name, password, True)
    new_account = json.loads(user.user_to_json(new_user))

    # store user in database
    table.insert_one(new_account)

    close_connection(client)
    return True

def get_projects_by_user_id(user_id):
    # Access projects that user is authorized to use
    client, table = access_projects()
    db_projs = list(table.find({"auth_users": {"$in": [user_id]}}))
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
=======
    client, table=open_connection()
    close_connection(client)
    return table.find()

def checkout_hw(id: str, hw_set: int, num: int, user: str) -> bool:
    client, table=open_connection()
    proj= table.find({"id":id})
>>>>>>> main

    if len(proj) == 0:
        close_connection(client)
        return False

<<<<<<< HEAD
    x = proj[0]
=======
    x=proj[0]
>>>>>>> main

    auth_users= json.loads(x.auth_users)
    if user not in auth_users:
        close_connection(client)
        return False

    if hw_set == '1':
        availability=x.hw_set1.availability
<<<<<<< HEAD
        newVal= {"$set":{"hw_set1.availability": math.max(0, availability-num)}}
    else:
        availability=x.hw_set2.availability
        newVal= {"$set":{"hw_set2.availability": math.max(0, availability-num)}}
=======
        newVal= {"$set":{"hw_set1.availability":math.max(0, availability-num)}}
    else:
        availability=x.hw_set2.availability
        newVal= {"$set":{"hw_set2.availability":math.max(0, availability-num)}}
>>>>>>> main


    table.update_one({"id":id}, newVal)

    close_connection(client)
    return True

<<<<<<< HEAD
def checkin_hw(id: str, hw_set: int, num: int, user: str) -> bool:
    client, table = access_projects()
    proj = table.find({"id":id})
=======


def checkin_hw(id: str, hw_set: int, num: int, user: str) -> bool:
    client, table=open_connection()
    proj= table.find({"id":id})
>>>>>>> main

    if len(proj) == 0:
        close_connection(client)
        return False

<<<<<<< HEAD
    x = proj[0]

    auth_users = json.loads(x.auth_users)
=======
    x=proj[0]

    auth_users= json.loads(x.auth_users)
>>>>>>> main
    if user not in auth_users:
        close_connection(client)
        return False

    if hw_set == '1':
<<<<<<< HEAD
        capacity = x.hw_set1.capacity
        availability = x.hw_set1.availabilty
        newVal = {"$set":{"hw_set1.availability":math.min(capacity, availability+num)}}

    else:
        capacity = x.hw_set2.capacity
        availability = x.hw_set2.availabilty
        newVal = {"$set":{"hw_set2.availability":math.min(capacity, availability+num)}}

    table.update_one({"id": id}, newVal)
=======
        capacity=x.hw_set1.capacity
        availability=x.hw_set1.availabilty
        newVal= {"$set":{"hw_set1.availability":math.min(capacity, availability+num)}}

    else:
        capacity=x.hw_set2.capacity
        availability=x.hw_set2.availabilty
        newVal= {"$set":{"hw_set2.availability":math.min(capacity, availability+num)}}

    table.update_one({"id":id}, newVal)
>>>>>>> main

    close_connection(client)
    return True

<<<<<<< HEAD
def join_project(id: str, user: str):
    client, table = access_projects()

    proj = table.find({"id": id})
=======


def join_project(id: str, userId: str):
    client, table=open_connection()

    proj= table.find({"id":id})
>>>>>>> main

    if len(proj) == 0:
        close_connection(client)
        return False

<<<<<<< HEAD
    x = proj[0]

    auth_users= json.loads(x.auth_users)
    if user not in auth_users:
        auth_users.append(user)
        table.update_one({"id":id}, {"$set": {"auth_users":auth_users}})    

    close_connection(client)

def leave_project(id: str, user: str):
    client, table = access_projects()

    proj = table.find({"id":id})
=======
    x=proj[0]

    auth_users= json.loads(x.auth_users)
    if userId not in auth_users:
        auth_users.append(userId)
        table.update_one({"id":id}, {"$set": {"auth_users":auth_users}})    
        user_database_access.add_project(userId, id)

    close_connection(client)
    return True


def leave_project(id: str, userId: str):
    client, table=open_connection()

    proj= table.find({"id":id})
>>>>>>> main

    if len(proj) == 0:
        close_connection(client)
        return False

<<<<<<< HEAD
    x = proj[0]

    auth_users= json.loads(x.auth_users)
    if user in auth_users:
        auth_users.remove(user)
        table.update_one({"id":id}, {"$set": {"auth_users":auth_users}})    

    close_connection(client)

def add_project(id: str, name: str, description: str, hw_set_1_qty: int, hw_set_2_qty: int, user_list: list) -> bool:
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
=======
    x=proj[0]

    auth_users= json.loads(x.auth_users)
    if userId in auth_users:
        auth_users.remove(userId)
        table.update_one({"id":id}, {"$set": {"auth_users":auth_users}})    
        user_database_access.leave_project(userId, id)

    close_connection(client)
    return True


def add_project(id:str, name:str, description: str, hw_set_1_qty: int, hw_set_2_qty: int, user_list: list)-> bool:
    client, table=open_connection()

    query = {"id":id}
    results=table.find(query)

    if len(results) != 0:
        close_connection(client)
        return False

    
    hw_1= container.hardware_set.HWSet(hw_set_1_qty)
    hw_2= container.hardware_set.HWSet(hw_set_2_qty)

    proj_def= container.project.Project(id, name, description, hw_1, hw_2, user_list)
    proj_json= container.project.project_to_json(proj_def)    
>>>>>>> main

    table.insert_one(proj_json)

    close_connection(client)

    return True
<<<<<<< HEAD

# add_project("wexler", "Project 5", "This is a basic description of Project 5", 100, 100, ["jcr4698"])
# print(login_user("jcr4698"))

=======
>>>>>>> main
