import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect'
import App from "../App";

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

test("Attempts to login", () => {
    render(<App />);

    const login_fail = jest.fn();
    login_fail.mockReturnValueOnce({"status": false})

    // Enter username
    const usernameInput = screen.getByPlaceholderText(/Enter Username/i);
    fireEvent.change(usernameInput, {target: {value: "FakeUsername"}});

    // Enter user id
    const userIdInput = screen.getByPlaceholderText(/Enter User ID/i);
    fireEvent.change(userIdInput, {target: {value: "FakeUserId"}});

    // Enter password
    const passwordInput = screen.getByPlaceholderText(/Enter Password/i);
    fireEvent.change(passwordInput, {target: {value: "FakePassword"}});

    // Press login button
    const login_btn = screen.getByRole("button", {name: "Login"});
    fireEvent.click(login_btn);
});

test("Register button is present", () => {
    render(<App />);

    const register_btn = screen.getByRole("button", {name: "Register"});
    expect(register_btn).toBeInTheDocument();
});
