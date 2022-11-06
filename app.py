import os
from flask import Flask, send_from_directory, jsonify, request
from backend.container import Project, HWSet, User
from backend.project_database_access import *
from encrypt import encrypt

app = Flask(__name__, static_url_path='', static_folder='frontend/build/')

# ----------------------------
# BEGIN HOME PAGE
# ----------------------------
@app.route('/')
def index():
    return send_from_directory('frontend/build/', 'index.html')

# ----------------------------
# END HOME PAGE
# ----------------------------

# ------------------------------------------------------------------------------
# BEGIN USER LOGIN AND REGISTER HANDLING FUNCTIONS
# ------------------------------------------------------------------------------
@app.route('/login', methods=['POST'])
def login_user():
    # Get request
    request = request.get_json()
    username = request['username']
    password = request['password']
    
    # Check if username from request is a username in the database 
    # Return 404 NOT FOUND ERROR if username not in usernames
    usernames = get_usernames()
    if username not in usernames:
        return {
            'username' : 'User does not exist',
            'password' : password
        }, 404

    # Encrypt password and check if it is same as password in database
    # Return 401 UNAUTHORIZED ERROR if password is not correct for username in database
    encrypted_request_password = encrypt(password, 1, 6)
    password_from_database = get_password_by_username(username)

    if encrypted_request_password != password_from_database:
        return {
            'username' : username,
            'password' : 'Password is not correct'
        }, 401

    # Valid login by this point so log them in by returning encrypted password as "access token" 
    # Return 200 SUCCESSFUL code for successful login
    return {
        'password' : password_from_database
    }, 200

    

@app.route('/register', methods=['POST'])
def register_user():
    request = request.json()
    username = request['username']
    password = request['password']

    usernames = get_usernames()
    # Check if username is already in the database (prevents creating duplicate user)
    # Return 409 CONFLICT ERROR code
    if username in usernames:
        return {
            'username' : 'Username already exists.',
            'password' : password
        }, 409
    
    # Encrypt password and register user
    encrypted_password = encrypt(password, 1, 6)

    new_user_to_register = User()
    new_user_to_register.set_username = username
    new_user_to_register.set_password = encrypted_password

    # Send user to database to add user
    add_user(new_user_to_register)

    # Return 201 SUCCESSFUL AND CREATED RESOURCE code
    return {
        'username': username,
        'password' : password
    }, 201

# ------------------------------------------------------------------------------
# END USER LOGIN AND REGISTER HANDLING FUNCTIONS
# ------------------------------------------------------------------------------


# ------------------------------------------------------------------------------
# BEGIN PROJECT HANDLING FUNCTIONS
# ------------------------------------------------------------------------------
@app.route('/', methods=['POST'])
def create_projects():
    pass

@app.route('/', methods=['GET'])
def get_projects():
    pass


@app.route('/', methods=['GET'])
def get_project_by_id(id):
    pass

@app.route('/', methods=['POST'])
def update_project_by_id(id):
    pass
# ------------------------------------------------------------------------------
# END PROJECT HANDLING FUNCTION
# ------------------------------------------------------------------------------


# ------------------------------------------------------------------------------
# BEGIN HWSET HANDLING FUNCTIONS
# ------------------------------------------------------------------------------
@app.route('/', methods=['POST'])
def create_hardware():
    pass

@app.route('/', methods=['GET'])
def get_hardware():
    pass

@app.route('/', methods=['GET'])
def get_hardware_by_id(id):
    pass

@app.route('/', methods=['GET'])
def update_hardware_by_id(id):
    pass

# ------------------------------------------------------------------------------
# END HWSET HANDLING FUNCTIONS
# ------------------------------------------------------------------------------






if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))
