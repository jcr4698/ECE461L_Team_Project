import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect'
import App from "../App";
import { Projects } from "../Projects"

/* Login Page Tests */

test("Login title exists", () => {
    render(<App />);

    // Make sure Login page is shown when app is first opened
    const page = screen.getByTestId("page-title").textContent;
    expect(page).toBe("Login");
});

test("Prompts user to enter username", () => {
    render(<App />);

    // Presence of username text
    const login_username = screen.getByTestId("login_username_test").textContent;
    expect(login_username).toBe("Username:");

    // Presence of username input box
    const usernameInput = screen.getByPlaceholderText(/Enter Username/i);
    expect(usernameInput).toBeInTheDocument();

    // username takes input (normal-case)
    fireEvent.change(usernameInput, {target: {value: "FakeUsername"}});
    expect(usernameInput.value).toBe("FakeUsername");
});

test("Prompts user to enter user id", () => {
    render(<App />);

    // Presence of user id text
    const login_userid = screen.getByTestId("login_userid_test").textContent;
    expect(login_userid).toBe("User ID:");

    // Presence of user id input box
    const userIdInput = screen.getByPlaceholderText(/Enter User ID/i);
    expect(userIdInput).toBeInTheDocument();

    // User ID takes input (normal-case)
    fireEvent.change(userIdInput, {target: {value: "FakeUserId"}});
    expect(userIdInput.value).toBe("FakeUserId");
});

test("Prompts user to enter password", () => {
    render(<App />);

    // Presence of password text
    const login_password = screen.getByTestId("login_password_test").textContent;
    expect(login_password).toBe("Password:");

    // Presence of password input box
    const passwordInput = screen.getByPlaceholderText(/Enter Password/i);
    expect(passwordInput).toBeInTheDocument();

    // Password takes input (normal-case)
    fireEvent.change(passwordInput, {target: {value: "FakePassword"}});
    expect(passwordInput.value).toBe("FakePassword");

    // Allows user to show/hide password
    const passShowInput = screen.getByTestId("show_password_test");
    expect(passShowInput).toBeInTheDocument();
});

test("Login button is present", () => {
    render(<App />);

    const login_btn = screen.getByRole("button", {name: "Login"});
    expect(login_btn).toBeInTheDocument();
});

test("Register button is present", () => {
    render(<App />);

    const register_btn = screen.getByRole("button", {name: "Register"});
    expect(register_btn).toBeInTheDocument();
});

/* Project Page Tests */

test("Projects' title exists", () => {
    render(<Projects />);

    // Title is correctly formatted when logged in
    const page = screen.getByTestId("page-title").textContent;
    expect(page).toBe("'s Projects");
});

test("Logout user", () => {
    render(<Projects />);

    // User is able to logout from projects page
    const logout_btn = screen.getByRole("button", {name: "logout"});
    expect(logout_btn).toBeInTheDocument();
});

test("Refresh projects' page", () => {
    render(<Projects />);

    // User is able to logout from projects page
    const refresh_btn = screen.getByRole("button", {name: "refresh"});
    expect(refresh_btn).toBeInTheDocument();
});

test("Hardware sets are displayed", () => {
    render(<Projects />);

     // HWSet 1 and 2 are present
     const hw_set_1 = screen.getByTestId("hw1_test").textContent;
     const hw_set_2 = screen.getByTestId("hw2_test").textContent;
     expect(hw_set_1).toBe("HWSet1:");
     expect(hw_set_2).toBe("HWSet2:");
});

test("Prompts user to create new project", () => {
    render(<Projects />);

    // Prompt user to enter project name
    const new_proj_name = screen.getByPlaceholderText(/Enter Project Name/i);
    expect(new_proj_name).toBeInTheDocument();

    // Prompt user to enter project id
    const new_proj_id = screen.getByPlaceholderText(/Enter Project ID/i);
    expect(new_proj_id).toBeInTheDocument();

    // Prompt user to enter project description (optional)
    const new_proj_desc = screen.getByPlaceholderText(/Enter Project Description/i);
    expect(new_proj_desc).toBeInTheDocument();

    // Prompts user to enter a list of authorized users
    const new_proj_users = screen.getByTestId("new_proj_desc");
    expect(new_proj_users).toBeInTheDocument();

    // Button to create project
    const add_proj_btn = screen.getByRole("button", {name: "Add Project"});
    expect(add_proj_btn).toBeInTheDocument();
});

test("Prompts user to join existing project", () => {
    render(<Projects />);

    // Presence of join text
    const join_proj_title = screen.getByTestId("join_project_test").textContent;
    expect(join_proj_title).toBe("Join Existing Project:");

    // Prompts user to enter existing project id
    const join_proj_id = screen.getByPlaceholderText(/Enter Project ID/i);
    expect(join_proj_id).toBeInTheDocument();

    // Button to join project
    const join_proj_btn = screen.getByRole("button", {name: "Join"});
    expect(join_proj_btn).toBeInTheDocument();
});

// test("projects page after")