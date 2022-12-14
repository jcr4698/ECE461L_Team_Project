import os
from flask import Flask, send_from_directory, request, jsonify
import json
from backend.project_database_access import *
import backend.container.user as user

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
        # Access HW Set values
        hw_sets = get_hw()
        hw_set_1 = hw_sets[0]
        hw_set_2 = hw_sets[1]
        return jsonify({
            "Status": True,
            "Projects": data_projs,
            "HW1": [hw_set_1["availability"], hw_set_1["capacity"]],
            "HW2": [hw_set_2["availability"], hw_set_2["capacity"]]
        })
    return jsonify({
        "Status": False
    })

@app.route('/project_add', methods = ["POST", "GET"], strict_slashes=False)
def project_add():
    data_json = request.get_json()
    if data_json is not None:

        # get project information
        proj_id = data_json["proj_id"]
        proj_data = data_json["proj_data"]
        proj_name = proj_data[1]
        proj_user_list = proj_data[3]
        proj_desc = data_json["proj_desc"]

        # attempt adding project
        added = add_project(proj_id, proj_name, proj_desc, proj_user_list)
        if added:
            return jsonify({
                "Status": True
            })
        return jsonify({
            "Status": False
        })
    return jsonify({
        "Status": False
    })

""" Add user_id to the project given. """
@app.route('/project_join', methods = ["POST", "GET"], strict_slashes=False)
def project_join():
    data_json = request.get_json()
    if data_json is not None:
        # get the project_id from data_json and check if it exists
        user_id = data_json["user_id"]
        proj_id = data_json["proj_id"]
        # determine successful join
        joined = join_project(proj_id, user_id)
        # if so, add user to that project and pass user_data
        if joined is not None:
            return jsonify({
                "Status": True,
                "Project": joined
            })
    return jsonify({
        "Status": False
    })

""" Delete user_id from the project id given. """
@app.route('/project_leave', methods = ["POST", "GET"], strict_slashes=False)
def project_leave():
    data_json = request.get_json()
    if data_json is not None:
        # get the project_id from data_json and check if it exists
        user_id = data_json["user_id"]
        proj_id = data_json["proj_id"]
        # determine successful join
        joined = leave_project(proj_id, user_id)
        # if so, add user to that project and pass user_data
        if joined is not None:
            if data_json is not None:
                # Access all projects associated with user_id from database
                data_projs = get_projects_by_user_id(user_id)
                # Access HW Set values
                hw_sets = get_hw()
                hw_set_1 = hw_sets[0]
                hw_set_2 = hw_sets[1]
                return jsonify({
                    "Status": True,
                    "Projects": data_projs,
                    "HW1": [hw_set_1["availability"], hw_set_1["capacity"]],
                    "HW2": [hw_set_2["availability"], hw_set_2["capacity"]]
                })
    return jsonify({
        "Status": False
    })

""" Begin user login. """
@app.route('/login', methods=['POST'], strict_slashes=False)
def login_user():
    # Get request
    user_info = request.get_json()

    # Obtain input credentials from request
    username = user_info["username"]
    user_id = user_info["user_id"]
    password = user_info["password"]
    user_from_request = user.User(user_id, username, password, True)

    # Obtain the username and password from user id
    user_from_database = try_login_user(user_id)
    if user_from_database is None:
        return {
            "status": False
        }

    # Check if username from request is a username in the database
    # Return 404 NOT FOUND ERROR if username not in usernames
    username_from_database = user_from_database.get_user_name()
    if user_from_request.get_user_name() != username_from_database:
        return {
            "status": False,
            'username': 'User does not exist',
            'password': password
        }

    # Encrypt password and check if it is same as password in database
    # Return 401 UNAUTHORIZED ERROR if password is not correct for username in database
    password_from_database = user_from_database.get_password()
    if user_from_request.get_password() != password_from_database:
        return {
            "status": False,
            'username': username,
            'password': 'Password is not correct'
        }

    # Valid login by this point so log them in by returning encrypted password as "access token"
    # Return 200 SUCCESSFUL code for successful login
    return {
        "status": True,
        'password': password_from_database
    }


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
    create_from_database = try_register_user(user_id, username, password)
    if not create_from_database:
        return {
            "status": False,
            "message": "INVALID ID: User ID already exists."
        }

    # Make sure password doesn't contain special chars
    if ("!" in password) or (" " in password):
        return {
            "status": False,
            "message": "INVALID PASSWORD: Password can't contain \"!\" or \" \"."
        }

    # Return 201 SUCCESSFUL AND CREATED RESOURCE code
    return {
        "status": True,
        'username': username,
        'password': password
    }


@app.route('/check_in', methods=['POST'])
def check_in():
    # Get request
    hw_info = request.get_json()
    proj_id = hw_info["proj_id"]
    hw_set = hw_info["hw_set"]
    check_in_val = hw_info["check_val"]
    user_id = hw_info["user_id"]

    # Check in appropriate units of hardware
    if checkin_hw(proj_id, hw_set, check_in_val, user_id):
        hw_sets = get_hw()
        hw_set_1 = hw_sets[0]
        hw_set_2 = hw_sets[1]
        return {
            "status": True,
            "message": "Successfully checked in " + str(check_in_val) + " hardware units into hardware set " + str(hw_set),
            "HW1": [hw_set_1["availability"], hw_set_1["capacity"]],
            "HW2": [hw_set_2["availability"], hw_set_2["capacity"]]
        }
    return {
        "status": False,
        "message": "Failed to check in " + check_in_val + " hardware units into hardware set " + hw_set
    }
    

@app.route('/check_out', methods=['POST'])
def check_out():
    # Get request
    hw_info = request.get_json()
    proj_id = hw_info["proj_id"]
    hw_set = hw_info["hw_set"]
    check_out_val = hw_info["check_val"]
    user_id = hw_info["user_id"]

    # Check out appropriate units of hardware
    if checkout_hw(proj_id, hw_set, check_out_val, user_id):
        hw_sets = get_hw()
        hw_set_1 = hw_sets[0]
        hw_set_2 = hw_sets[1]

        return {
            "status": True,
            "message": "Successfully checked out " + str(check_out_val) + " hardware units from hardware set " + str(hw_set),
            "HW1": [hw_set_1["availability"], hw_set_1["capacity"]],
            "HW2": [hw_set_2["availability"], hw_set_2["capacity"]]
        }
    return {
        "status": False,
        "message": "Failed to check out " + check_out_val + " hardware units from hardware set " + hw_set
    }

@app.route('/get_project_description', methods=['POST'])
def get_proj_description():
    # Get request
    hw_info = request.get_json()
    proj_id = hw_info["proj_id"]
    project_descr = get_project_description(proj_id)
    if project_descr is not None:
        return {
            "status": True,
            "project_description": project_descr,
            "message": "Received project description for project " + proj_id
        }
    return {
        "status": False,
        "project_description": None,
        "message": "No project description"
    }

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))
