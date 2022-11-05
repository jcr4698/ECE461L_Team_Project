import os
from flask import Flask, send_from_directory, jsonify, request
from backend.container import Project, HWSet, User

app = Flask(__name__, static_url_path='', static_folder='frontend/build/')

# ----------------------------
# HOME PAGE
# ----------------------------
@app.route('/')
def index():
    return send_from_directory('frontend/build/', 'index.html')

""" Test out sending data to frontend. """
@app.route('/test')
def test():
    return send_from_directory('backend/', 'test.json')

# ----------------------------
# BEGIN USER LOGIN AND REGISTER HANDLING FUNCTIONS
# ----------------------------
@app.route('/login', methods=['POST'])
def login():
    pass

@app.route('/register', methods=['POST'])
def register():
    pass

# ----------------------------
# END USER LOGIN AND REGISTER HANDLING FUNCTIONS
# ----------------------------


# ----------------------------
# BEGIN PROJECT HANDLING FUNCTIONS
# ----------------------------
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
# ----------------------------
# END PROJECT HANDLING FUNCTION
# ----------------------------


# ----------------------------
# BEGIN HWSET HANDLING FUNCTIONS
# ----------------------------
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

# ----------------------------
# END HWSET HANDLING FUNCTIONS
# ----------------------------









if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))
