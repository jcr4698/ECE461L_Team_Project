import pytest_check as check
import project_database_access

# Register
user = "newUser"
password = "EnCrYpTeDPaSsWoRd"
registeredUser = project_database_access.try_register_user(user, password)
check.equal(registeredUser, not None)

# Register user that already exists
registeredUser = project_database_access.try_register_user(user, password)
check.equal(registeredUser, None)

# Login Valid User
signedInUser = project_database_access.try_login_user(user)
check.equal(signedInUser, not None)

#Login Invalid User
user = "notRegisteredUser"
signedInUser = project_database_access.try_login_user(user)
check.equal(signedInUser, None)

# Create Project
project_id = "1"
name = "project1"
description = "my first project"
user_list: "newUser"
added_project = project_database_access.add_project(project_id, name, description, user_list)
check.equal(added_project, True)

# Create Project with existing ID
added_project = project_database_access.add_project(project_id, name, description, user_list)
check.equal(added_project, False)

# Join Project
secondUser = "newUser2"
password = "EnCrYpTeDPaSsWoRd2"
project_database_access.try_register_user(secondUser, password)
joined_project = project_database_access.join_project("1", secondUser)
check.equal(joined_project, not None)

# Join project that doesn't exist
thirdUser = "newUser3"
password = "EnCrYpTeDPaSsWoRd3"
project_database_access.try_register_user(thirdUser, password)
joined_project = project_database_access.join_project("2", thirdUser)
check.equal(joined_project, None)

# Leave Project

# Check In

# Check Out

# View Description
