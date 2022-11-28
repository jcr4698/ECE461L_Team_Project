import React from 'react';
import './Login.css';

/* Components */

// Login: Displays the list of projects to page
class Login extends React.Component {

    // render: Structure the login page
    render() {
        return (
            <div className="login_wrap">
                <p className="project_title">
                    Login
                </p>
                <LoginUser
                    onLoginClick={() => this.handleLogin()}
                    onRegisterClick={() => this.handleRegister()} />
                <div className="empty_space" />
            </div>
        )
    }

    /* Handlers */

    // handleLogin: Determine whether a valid account is entered
    handleLogin() {
        /* Obtain username and password */
        const id = document.getElementById("id_login").value;
        const user = document.getElementById("user_login").value;
        const pass = document.getElementById("password_login").value;

        /* Make sure inputs are not empty */
        if(typeof id === 'string' && typeof user === 'string' && typeof pass === 'string') {
			if(id.trim() !== '' && user.trim() !== '' && pass.trim() !== '') {

                console.log("user id:", id)
                console.log("username:", user);
                console.log("password:", pass);

                /* Authenticate credentials */
                fetch("/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: user,
                        user_id: id,
                        password: pass
                    })
                })
                .then(response => response.json())
                .then(respJson => {
                    console.log(respJson["status"]);

                    /* login (success or fail) */
                    if(respJson["status"]) {
                        this.props.handleLoginStatus(respJson["status"], id, user)
                    }
                    else {
                        alert("Username, ID, or Password didn't match an account.")
                    }
                });

            }
        }
    }

    // handleRegister: Register a new user, unless user id is same as someone else
    handleRegister() {
        /* Obtain username and password */
        const id = document.getElementById("id_login").value;
        const user = document.getElementById("user_login").value;
        const pass = document.getElementById("password_login").value;

        /* Make sure inputs are not empty */
        if(typeof id === 'string' && typeof user === 'string' && typeof pass === 'string') {
			if(id.trim() !== '' && user.trim() !== '' && pass.trim() !== '') {

                console.log("user id:", id)
                console.log("username:", user);
                console.log("password:", pass);

                /* Authenticate credentials */
                fetch("/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: user,
                        user_id: id,
                        password: pass
                    })
                })
                .then(response => response.json())
                .then(respJson => {
                    console.log(respJson["status"]);

                    /* login (success or fail) */
                    if(respJson["status"]) {
                        this.props.handleLoginStatus(respJson["status"], id, user)
                        alert("Your account has been created! Remember your credentials!")
                    }
                    else {
                        alert("User ID already exists. Try a different one.")
                    }
                });

            }
        }
    }

}

/* HTML */

// LoginUser: HTML that prompts user to log-in, create account, or change password
function LoginUser(props) {
    return (
        <div className="login">
            {/* Login Row 0 - Username */}
            <div className="login_row">
                {/* Username Column 0 - Text */}
                <div className="login_info_column">
                    <p className="user">
                        Username:
                    </p>
                </div>
                {/* Username Column 1 - Input */}
                <div className="login_info_column">
                    <input
                        className="new_project_input"
                        id="user_login"
                        type="text"
                        placeholder="Enter Username" />
                </div>
            </div>
            {/* Login Row 1 - User ID */}
            <div className="login_row">
                {/* User ID Column 0 - Text */}
                <div className="login_info_column">
                    <p className="user">
                        User ID:
                    </p>
                </div>
                {/* User ID Column 1 - Input */}
                <div className="login_info_column">
                    <input
                        className="new_project_input"
                        id="id_login"
                        type="text"
                        placeholder="Enter User ID" />
                </div>
            </div>
            {/* Login Row 2 - Password */}
            <div className="login_row">
                {/* Password Column 0 - Text */}
                <div className="login_info_column">
                    <p className="user">
                        Password:
                    </p>
                </div>
                {/* Password Column 1 - Input */}
                <div className="login_info_column">
                    <input
                        className="new_project_input"
                        id="password_login"
                        type="password"
                        placeholder="Enter Password" />
                </div>
            </div>
            {/* Empty Space */}
            <div className="empty_space" />
            {/* Login Row 2 - Buttons */}
            <div className="login_row">
                {/* Button Column 0 - Login */}
                <div className="login_btns_column">
                    <button
                        className="login_btn"
                        id="login_btn"
                        type="button"
                        onClick={props.onLoginClick} >
                        Login
                    </button>
                </div>
                {/* Button Column 1 - Forgot */}
                {/* <div className="login_btns_column">
                    <button
                        className="login_btn"
                        id="forgot_btn"
                        type="button"
                        onClick={props.onForgotClick} >
                        Forgot
                    </button>
                </div> */}
                {/* Button Column 2 - Register */}
                <div className="login_btns_column">
                    <button
                        className="login_btn"
                        id="register_btn"
                        type="button"
                        onClick={props.onRegisterClick} >
                        Register
                    </button>
                </div>
            </div>
        </div>
    )
}

export {Login};
