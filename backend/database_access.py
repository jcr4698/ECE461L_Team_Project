from pymongo import MongoClient

def open_connection():
    client=MongoClient("mongodb+srv://user:1234@cluster0.gdxcywm.mongodb.net/?retryWrites=true&w=majority")
    return client

def close_connection(client: MongoClient):
    client.close()

def checkout_hw(project_id: str, hw_set: int, num: int, user: str):
    pass

def checkin_hw(project_id: str, hw_set: int, num: int, user: str):
    pass

def join_project(project_id: str, user: str):
    pass

def leave_project(project_id: str, user: str):
    pass

def add_project(user_list: list, hw_set_1_qty: int, hw_set_2_qty: int):
    client=open_connection()
    projects_db=client['Projects']
    pass