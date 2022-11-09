from pymongo import MongoClient
import container.project, container.hardware_set
import json
import math
import user_database_access

def open_connection():
    client=MongoClient("mongodb+srv://user:1234@cluster0.gdxcywm.mongodb.net/?retryWrites=true&w=majority")
    db=client['project_app']
    table=db['Projects']
    return client, table


def close_connection(client: MongoClient):
    client.close()

def get_all_projects():
    client, table=open_connection()
    close_connection(client)
    return table.find()

def checkout_hw(id: str, hw_set: int, num: int, user: str) -> bool:
    client, table=open_connection()
    proj= table.find({"id":id})

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
    client, table=open_connection()
    proj= table.find({"id":id})

    if len(proj) == 0:
        close_connection(client)
        return False

    x=proj[0]

    auth_users= json.loads(x.auth_users)
    if user not in auth_users:
        close_connection(client)
        return False

    if hw_set == '1':
        capacity=x.hw_set1.capacity
        availability=x.hw_set1.availabilty
        newVal= {"$set":{"hw_set1.availability":math.min(capacity, availability+num)}}

    else:
        capacity=x.hw_set2.capacity
        availability=x.hw_set2.availabilty
        newVal= {"$set":{"hw_set2.availability":math.min(capacity, availability+num)}}

    table.update_one({"id":id}, newVal)

    close_connection(client)
    return True



def join_project(id: str, userId: str):
    client, table=open_connection()

    proj= table.find({"id":id})

    if len(proj) == 0:
        close_connection(client)
        return False

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

    if len(proj) == 0:
        close_connection(client)
        return False

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

    table.insert_one(proj_json)

    close_connection(client)

    return True
