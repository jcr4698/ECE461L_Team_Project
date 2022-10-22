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
                    onLoginClick={() => this.handleLogin()} />
                <div className="empty_space" />
            </div>
        )
    }

    /* Handlers */

    // handleLogin: Determine whether a valid account is entered
    handleLogin() {
        /* Obtain username and password */
        const user = document.getElementById("user_login").value;
        const pass = document.getElementById("password_login").value;
        console.log(user);
        console.log(pass);

        /* Authenticate credentials */
        const valid_account = true; // for testing purposes

        /* login (success or fail) */
        this.props.handleLoginStatus(valid_account);
    }

}

/* HTML */

// LoginUser: HTML that prompts user to log-in, create account, or change password
function LoginUser(props) {
    return (
        <div className="login">
            {/* Login Row 0 - Username*/}
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
                        placeholder="Enter Username"
                        /* onChange={props.} */ />
                </div>
            </div>
            {/* Login Row 1 - Password*/}
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
                        type="text"
                        placeholder="Enter Password"
                        /* onChange={props.} */ />
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
                <div className="login_btns_column">
                    <button
                        className="login_btn"
                        id="forgot_btn"
                        type="button"
                        /* onClick={props.onForgotClick} */ >
                        Forgot
                    </button>
                </div>
                {/* Button Column 2 - Register */}
                <div className="login_btns_column">
                    <button
                        className="login_btn"
                        id="register_btn"
                        type="button"
                        /* onClick={props.onRegisterClick}*/ >
                        Register
                    </button>
                </div>
            </div>
        </div>
    )
}

export {Login};
