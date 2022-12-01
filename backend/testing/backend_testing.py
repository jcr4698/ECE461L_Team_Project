import pytest_check as check
import project_database_access

# Login
user = "user1"
password = "EnCrYpTeDPaSsWoRd"
signedInUser = project_database_access.try_login_user(user, password)
check.equal(signedInUser, not None)

# Register
user = "newUser"
password = "EnCrYpTeDPaSsWoRd"
registeredUser = project_database_access.try_register_user(user, password)
check.equal(registeredUser, not None)

# Create Project
project_id = "1"
name = "project1"
description = "my first project"
user_list: "newUser"
added_project = project_database_access.add_project(project_id, name, description, user_list)
check.equal(added_project, True)

# Join Project
secondUser = "newUser2"
password = "EnCrYpTeDPaSsWoRd2"
project_database_access.try_register_user(secondUser, password)
joined_project = project_database_access.join_project("1", secondUser)
check.equal(joined_project, not None)

# Leave Project

# Check In

# Check Out

# View Description
