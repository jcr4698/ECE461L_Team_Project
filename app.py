import os
from flask import Flask, send_from_directory, request, jsonify
import json
from backend.container import *
from backend.project_database_access import *
from backend.encrypt import encrypt

app = Flask(__name__, static_url_path='', static_folder='frontend/build/')

@app.route('/')
def index():
    return send_from_directory('frontend/build/', 'index.html')


@app.route('/project_init', methods=["POST"], strict_slashes=False)
def project_get():
    data_json = request.get_json()
    if data_json is not None:
        req_user_id = data_json["user_id"]
        # Access all projects associated with user_id from database
        data_projs = get_projects_by_user_id(req_user_id)
        return jsonify({
                            "Status": True,
                            "Projects": data_projs
                        })
    return jsonify({
                    "Status": False
                    })

@app.route('/project_list', methods = ["POST", "GET"], strict_slashes=False)
def project_add():
    if request.method == "POST":
        data_json = request.get_json()
        if data_json is not None:
            proj_data = data_json["proj_data"]
            proj_handle = data_json["proj_handle"][0]
            proj_id = proj_data[2]
            with open("backend/project_list.json", "r+") as file_proj:
                file_json = json.load(file_proj)
                proj_exists = False
                for proj_arr in file_json.items():
                    if proj_id == proj_arr[1][2]:
                        proj_exists = True
                if proj_exists == False:
                    file_proj.seek(0)
                    file_json[proj_handle] = proj_data
                    json.dump(file_json, file_proj, indent=4)
                    # Store file_json data in database
                return jsonify({proj_handle: proj_exists})
        return jsonify({"Status": False})
    elif request.method == "GET":
        # Get user
        data_json = request.get_json()
        if data_json is not None:
            req_user = data_json["user_id"]
            # Access all projects associated with user_id from database
            db_proj = get_all_projects(req_user)
            return jsonify({"Status": True,
                            "Projects": db_proj})
        return jsonify({"Status": False})


user_creds = {}


""" Begin user login. """
@app.route('/login', methods=['POST'], strict_slashes=False) ### test this out now with strict slashes off
def login_user():
    # Get request
    user_info = request.get_json()

    # Obtain input credentials from request
    username = user_info["username"]
    user_id = user_info["user_id"]
    password = user_info["password"]

    # Obtain the username and password from user id
    creds_from_database = user_creds.get(user_id)
    if creds_from_database is None:
        return {
            "status": False
        }

    # Check if username from request is a username in the database
    # Return 404 NOT FOUND ERROR if username not in usernames
    # usernames = get_usernames() ############################################################# to be implemented
    username_from_database = creds_from_database[0]
    # print(creds_from_database)
    if username != username_from_database:
        return {
            "status": False,
            'username' : 'User does not exist',
            'password' : password
        }#, 404

    # Encrypt password and check if it is same as password in database
    # Return 401 UNAUTHORIZED ERROR if password is not correct for username in database
    encrypted_request_password = encrypt(password, 1, 6)
    # password_from_database = get_password_by_username(username) ############################# to be implemented
    password_from_database = user_creds[user_id][1]
    # print(password_from_database)
    if encrypted_request_password != password_from_database:
        return {
            "status": False,
            'username' : username,
            'password' : 'Password is not correct'
        }#, 401

    # Valid login by this point so log them in by returning encrypted password as "access token"
    # Return 200 SUCCESSFUL code for successful login
    return {
        "status": True,
        'password' : password_from_database
    }#, 200


""" Begin user registration. """
@app.route('/register', methods=['POST'])
def register_user():
    # Get request
    user_info = request.get_json()

    # Obtain input credentials from request
    username = user_info["username"]
    user_id = user_info["user_id"]
    password = user_info["password"]

     # Obtain the username and password from user id
    creds_from_database = user_creds.get(user_id)
    if creds_from_database is not None:
        return {
            "status": False,
            "message": "INVALID ID: User ID already exists."
        }

    # # usernames = get_usernames()################################################################## to be implemented
    # # Check if username is already in the database (prevents creating duplicate user)
    # # Return 409 CONFLICT ERROR code
    # if username in usernames:
    #     return {
    #         'username' : 'Username already exists.',
    #         'password' : password
    #     }#, 409

    # Make sure password doesn't contain special chars
    if ("!" in password) or (" " in password):
        return {
            "status": False,
            "message": "INVALID PASSWORD: Password can't contain \"!\" or \" \"."
        }

    # Encrypt password
    encrypted_password = encrypt(password, 1, 6)

    # new_user_to_register = User()
    # new_user_to_register.set_username = username
    # new_user_to_register.set_password = encrypted_password ########################################## doesn't work yet

    user_creds[user_id] = [username, encrypted_password]

    # Send user to database to add user
    # add_user(new_user_to_register)    ############################################################ to be implemented

    # Return 201 SUCCESSFUL AND CREATED RESOURCE code
    return {
        "status": True,
        'username': username,
        'password' : password
    }#, 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))

