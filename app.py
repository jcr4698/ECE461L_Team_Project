import os
from flask import Flask, send_from_directory, jsonify

app = Flask(__name__, static_url_path='', static_folder='frontend/build/')

@app.route('/')
def index():
    return send_from_directory('frontend/build/', 'index.html')

""" Test out sending data to frontend. """
@app.route('/test')
def test():
    return send_from_directory('backend/', 'test.json')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))
