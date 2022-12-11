
from flask import Flask, send_from_directory, request, jsonify
import json
from backend.project_database_access import *
import backend.container.user as user

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
