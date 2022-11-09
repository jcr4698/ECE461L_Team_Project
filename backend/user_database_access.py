from pymongo import MongoClient
import container.hardware_set, container.user
import json

NUM_SHIFT=5
DECODE_DIRECTION=-1
ENCRYPT_DIRECTION=1


def open_connection_user():
    client=MongoClient("mongodb+srv://user:1234@cluster0.gdxcywm.mongodb.net/?retryWrites=true&w=majority")
    db=client['project_app']
    table=db['Users']
    return client, table

def close_connection(client: MongoClient):
    client.close()

def user_login(userId, username, password) -> bool:
    client, table=open_connection_user()

    user=table.find({"userId": userId})
    if(len(user) == 0):
        close_connection(client)
        return False
    

    x_user=user[0]
    password_decrypt=customEncrypt(x_user["password"], NUM_SHIFT, DECODE_DIRECTION)
    if x_user["username"].equals(username):
        if password_decrypt.equals(password):
            close_connection(client)
            return True

    close_connection(client)
    return False

def register_user(userId, username, password) -> bool:
    client, table=open_connection_user()

    user=table.find({"userId": userId})
    if(len(user) > 0):
        close_connection(client)
        return False
    

    password_encrypt=customEncrypt(password, NUM_SHIFT, ENCRYPT_DIRECTION)

    user_def= container.user.User(userId, username, password_encrypt, [])
    user_json=container.user.user_to_json(user_def)

    table.insert_one(user_json)

    close_connection(client)
    return True


""" below methods called automatically when join_project from project_database_access
"""
def join_project(userId, projectId):
    client, table=open_connection_user()

    user=table.find({"userId":userId})
    if len(user) == 0:
        close_connection(client)
        return False
    
    x = user[0]
    proj_list=json.loads(x.project_list)
    if projectId not in proj_list:
        proj_list.append(projectId)
        table.update_one({"userId":userId}, {"$set": {"project_list":proj_list}})

    close_connection(client)
    return True

def leave_project(userId, projectId):
    client, table=open_connection_user()

    user=table.find({"userId":userId})
    if len(user) == 0:
        close_connection(client)
        return False
    
    x = user[0]
    proj_list=json.loads(x.project_list)
    if projectId in proj_list:
        proj_list.remove(projectId)
        table.update_one({"userId":userId}, {"$set": {"project_list":proj_list}})

    close_connection(client)
    return True


""" INPUTTEXT is the message to be encrypted.
    Shift characters N values in direction D
    left for -1 and right for +1. """
def customEncrypt(inputText, n, d):
    return _reverse_chars(_shift_chars(inputText, d*n))

""" Determine whether INPUTTEXT has a '!' or ' '.
    If so, return false. """
def validText(inputText):
    if ('!' in inputText) or (' ' in inputText):
        return False
    return True

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