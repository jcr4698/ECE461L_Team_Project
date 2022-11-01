from pymongo import MongoClient
import project, hardware_set


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

def checkout_hw(project_name: str, hw_set: int, num: int, user: str):
    client, table=open_connection()

    close_connection(client)

def checkin_hw(project_name: str, hw_set: int, num: int, user: str):
    client, table=open_connection()

    close_connection(client)

def join_project(project_name: str, user: str):
    client, table=open_connection()

    close_connection(client)

def leave_project(project_name: str, user: str):
    client, table=open_connection()

    close_connection(client)

def add_project(project_name:str, user_list: list, hw_set_1_qty: int, hw_set_2_qty: int):
    client, table=open_connection()

    query = {"project_name": project_name}
    results=table.find(query)

    if len(results) != 0:
        close_connection(client)
        return False

    
    hw_1= hardware_set.HWSet(hw_set_1_qty, "1", user_list)
    hw_2= hardware_set.HWSet(hw_set_2_qty, "2", user_list)

    proj_def= {"project_name": project_name, "hwset_1": hw_1, "hwset_2": hw_2, "auth_users": user_list}

    table.insert_one(proj_def)

    close_connection(client)
