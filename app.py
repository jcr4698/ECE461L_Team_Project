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
    pass

@app.route('/register', methods=['POST'])
def register_user():
    pass

# ------------------------------------------------------------------------------
# END USER LOGIN AND REGISTER HANDLING FUNCTIONS
# ------------------------------------------------------------------------------


# ------------------------------------------------------------------------------
# BEGIN PROJECT HANDLING FUNCTIONS
# ------------------------------------------------------------------------------
@app.route('/', methods=['POST'])
def create_project():
    pass
@app.route('/', methods=['GET'])
def get_projects_by_user(user):
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
