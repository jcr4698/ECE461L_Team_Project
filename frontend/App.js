import React from 'react';
import './App.css';

// App: Function that runs Project
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      is_logged_in: false
    }
  }

  render() {
    // conditional rendering
    if(this.state.is_logged_in) {
      return(
        <div className="App">
          <header className="app_header">
            <Projects />
          </header>
        </div>
      )
    }
    else {
      return(
        <div className="App">
          <header className="app_header">
            <Login
              handleLoginStatus={this.handleLoginStatus}
            />
          </header>
        </div>
      )
    }
  }

  handleLoginStatus = (logged_in) => {
    this.setState({
      is_logged_in: logged_in
    })
  }
  
}

export default App;

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      registered_user: false
    }
  }

  render() {
    return(
      <div className="login_wrap">
        <p className="project_title">Login</p>
        <LoginUser
          onLoginClick={() => this.handleLogin()}
        />
        <div className="empty_space"/>
      </div>
    )
  }

  handleLogin() {
    const user = document.getElementById("user_login").value;
    const pass = document.getElementById("password_login").value;
    console.log(user);
    console.log(pass);

    this.props.handleLoginStatus(true);
  }

}

// Project: Displays the list of projects to page
class Projects extends React.Component {
  render() {
    return(
      <div className="project_wrap">
        <p className="project_title">Projects</p>
        <ProjectData />
        <div className="empty_space"/>
      </div>
    )
  }
}

// Place data into a stored list
class ProjectData extends React.Component {

  // Initialize data
  constructor(props) {
    super(props);
    this.state = {
      curr_project_name: "",
      curr_project_user: "",
      project_list: []
    };
    this.state.project_list.push([0, "Project 0", "User 1", 0, [50, 0, 0], 100, [30, 0, 0], 100])
    this.state.project_list.push([1, "Project 1", "User 2", 0, [50, 0, 0], 100, [0, 0, 0], 100])
    this.state.project_list.push([2, "Project 2", "User 3", 0, [10, 0, 0], 50, [30, 0, 0], 50])
    this.state.project_list.push([3, "Project 3", "User 4", 0, [50, 0, 0], 70, [30, 0, 0], 50])
  }

  // Create a single project with given data
  renderProject(i, proj, usr, hw1_avail, hw1_cap, hw2_avail, hw2_cap) {
    return(
      <Project
        key={i.toString()}  // "key" is recommended by console (don't use it much in project tho)
        idx = {i}
        Name = {proj}
        User = {usr}
        HWSet1_Availability = {hw1_avail[0]}
        HWSet1_Capacity = {hw1_cap}
        HWSet2_Availability = {hw2_avail[0]}
        HWSet2_Capacity = {hw2_cap}
        onCheckInValue={(e) => this.handleCheckInValue(e.target.value, i)}
        onCheckInClick={() => this.handleCheckIn(i)}
        onCheckOutValue={(e) => this.handleCheckOutValue(e.target.value, i)}
        onCheckOutClick={() => this.handleCheckOut(i)}
        onHWSelection={() => this.handleHWSelection(i)}
      />
    )
  }

  // Create template that prompts user to make new project
  renderNewProject() {
    return(
      <ProjectAdder
          onNewProjectClick={() => this.handleNewProject()}
          onNewProjectName={() => this.handleNewProjectName()}
          onNewProjectUser={() => this.handleNewProjectUser()}
      />
    )
  }

  // Update page with the data stored
  render() {
    const new_project_list = [];
    const project_list = this.state.project_list.slice();
    for(let i = 0; i < project_list.length; i++) {
      const project_data = project_list[i];
      new_project_list.push(this.renderProject(project_data[0],
                                               project_data[1],
                                               project_data[2],
                                               project_data[4],
                                               project_data[5],
                                               project_data[6],
                                               project_data[7]));
    }
    return(
      <div>
        {new_project_list}
        <div className="empty_space"/>
        {this.renderNewProject()}
      </div>
    )
  }

  //// Handlers

  // Change between HWSet 1 and HWSet 2 settings
  handleHWSelection(i) {
    const project_list = this.state.project_list.slice();
    var curr_hw_selection = parseInt(document.getElementById("hw_set:"+project_list[i][1]).value);
    project_list[i][3] = curr_hw_selection;
    this.setState({
      project_list: project_list
    })
    this.handleCheckInValue(document.getElementById("check_in:"+project_list[i][1]).value, i);
    this.handleCheckOutValue(document.getElementById("check_out:"+project_list[i][1]).value, i);
  }

  // Add and display new values to interface
  handleCheckIn(i) {
    const project_list = this.state.project_list.slice();
    const hw_idx = project_list[i][3];
    const check_in_val = document.getElementById("check_in:"+project_list[i][1]).value;
    if(check_in_val !== "") {
      if(project_list[i][4 + 2*hw_idx][0] + project_list[i][4 + 2*hw_idx][1] <= project_list[i][4 + 2*hw_idx + 1]) {
        project_list[i][4 + 2*hw_idx][0] += project_list[i][4 + 2*hw_idx][1];
        project_list[i][4 + 2*hw_idx][1] = 0;
        this.setState({
          project_list: project_list
        });
        document.getElementById("check_in:"+project_list[i][1]).value = "";
      }
    }
  }

  // Update value to add before Check-In
  handleCheckInValue(val, i) {
    var new_check_in_value = parseInt(val);
    if(!isNaN(new_check_in_value)) {
      const project_list = this.state.project_list.slice();
      const hw_idx = project_list[i][3];
      project_list[i][4 + 2*hw_idx][1] = new_check_in_value;
      this.setState({
        project_list: project_list
      })
    }
  }

  // Subtract and display new values to interface
  handleCheckOut(i) {
    const project_list = this.state.project_list.slice();
    const hw_idx = project_list[i][3];
    const check_out_val = document.getElementById("check_out:"+project_list[i][1]).value;
    if(check_out_val !== "") {
      if(project_list[i][4 + 2*hw_idx][0] - project_list[i][4 + 2*hw_idx][2] >= 0) {
        project_list[i][4 + 2*hw_idx][0] -= project_list[i][4 + 2*hw_idx][2];
        project_list[i][4 + 2*hw_idx][2] = 0;
        this.setState({
          project_list: project_list
        });
        document.getElementById("check_out:"+project_list[i][1]).value = "";
      }
    }
  }

  // Update value to subtract before Check-In
  handleCheckOutValue(val, i) {
    var new_check_in_value = parseInt(val);
    if(!isNaN(new_check_in_value)) {
      const project_list = this.state.project_list.slice();
      const hw_idx = project_list[i][3];
      project_list[i][4 + 2*hw_idx][2] = new_check_in_value;
      this.setState({
        project_list: project_list
      })
    }
  }

  // Add new HWSet to Data
  handleNewProject() {
    const project_name = this.state.curr_project_name;
    const project_user = this.state.curr_project_user;
    if(typeof project_name === 'string' && typeof project_user === 'string') {
      if(project_name.trim() !== '' && project_user.trim() !== '') {
        const project_list = this.state.project_list.slice();
        project_list.push([project_list.length, project_name, project_user, 0, [50, 0, 0], 100, [30, 0, 0], 50]);
        this.setState({
          project_list: project_list,
        })
        document.getElementById("new_project_name").value = "";
        document.getElementById("new_project_user").value = "";
      }
    }
  }

  // Update value of current new project name
  handleNewProjectName() {
    var new_project_name = document.getElementById("new_project_name").value;
    this.setState({
      curr_project_name: new_project_name
    })
  }

  // Update value of current user
  handleNewProjectUser() {
    var new_project_user = document.getElementById("new_project_user").value;
    this.setState({
      curr_project_user: new_project_user
    })
  }

}

// LoginUser: Prompts user to log-in, create account, or change password
function LoginUser(props) {
  return(
    <div className="login">
      {/* Username */}
      <div className="login_row">
        <div className="login_info_column">
          <p className="user">Username:</p>
        </div>
        <div className="login_info_column">
          <input className="new_project_input"
                id="user_login"
                type="text"
                placeholder="Enter Username"
                // onChange={props.}
          />
        </div>
      </div>
      {/* Password */}
      <div className="login_row">
        <div className="login_info_column">
          <p className="user">Password:</p>
        </div>
        <div className="login_info_column">
          <input className="new_project_input"
                id="password_login"
                type="text"
                placeholder="Enter Password"
                // onChange={props.}
          />
        </div>
      </div>
      {/* Empty Space */}
      <div className="empty_space"/>
      {/* Login */}
      <div className="login_row">
        <div className="login_btns_column">
          <button className="login_btn"
                  id="login_btn"
                  type="button"
                  onClick={props.onLoginClick}
          >
            Login
          </button>
        </div>
        <div className="login_btns_column">
          <button className="login_btn"
                  id="forgot_btn"
                  type="button"
                  // onClick={props.onForgotClick}
          >
            Forgot
          </button>
        </div>
        <div className="login_btns_column">
          <button className="login_btn"
                    id="register_btn"
                    type="button"
                    // onClick={props.onRegisterClick}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  )
}

// Project: Format Project with props given
function Project(props) {
  return(
    <div className="project">
        {/* Title */}
        <div className="project_column">
          <p className="project_name">{props.Name}</p>
        </div>
        {/* Users with Access */}
        <div className="project_column">
          <p className="user">{props.User}</p>
        </div>
        {/* Sets available */}
        <div className="project_column">
          <p className="hw_description">HWSet1: {props.HWSet1_Availability}/{props.HWSet1_Capacity}</p>
          <p className="hw_description">HWSet2: {props.HWSet2_Availability}/{props.HWSet2_Capacity}</p>
        </div>
        {/* Select HW */}
        <div className="project_column">
          <p className="hw_description">Select HWSet:</p>
          <select className="hw_select"
                  id={"hw_set:"+props.Name}
                  name="hwset"
                  onChange={props.onHWSelection}
          >
            <option value="0">HWSet 1</option>
            <option value="1">HWSet 2</option>
          </select>
        </div>
        {/* Check In */} 
        <div className="project_column">
          <input className="hw_input"
                 id={"check_in:"+props.Name}
                 type="text"
                 placeholder="Enter Value"
                 onChange={(e) => props.onCheckInValue(e)}
          />
          <button className="check_btn"
                  type="button"
                  onClick={props.onCheckInClick}
          >
            Check In
          </button>
        </div>
        {/* Check Out */}
        <div className="project_column">
          <input className="hw_input"
                 id={"check_out:"+props.Name}
                 type="text"
                 placeholder="Enter Value"
                 onChange={(e) => props.onCheckOutValue(e)}
          />
          <button className="check_btn"
                  type="button"
                  onClick={props.onCheckOutClick}
          >
            Check Out
          </button>
        </div>
        {/* Join or Leave */}
        <div className="project_column">
          <button className="join_btn"
                  type="button"
          >
            Join
          </button>
        </div>
    </div>
  )
}

// ProjectAdder: Adds a user input to project data
function ProjectAdder(props) {
  return(
    <div className="project">
      {/* Title */}
      <div className="new_project_column">
        <input className="new_project_input"
               id="new_project_name"
               type="text"
               placeholder="Enter Project Name"
               onChange={props.onNewProjectName}
        />
      </div>
      {/* Users with Access */}
      <div className="new_project_column">
        <input className="new_project_input"
               id="new_project_user"
               type="text"
               placeholder="Enter Username"
               onChange={props.onNewProjectUser}
        />
      </div>
      {/* Join or Leave */}
      <div className="new_project_column">
        <button className="add_project_btn" type="button" onClick={props.onNewProjectClick}>Add Project</button>
      </div>
    </div>
  )
}

// USEFUL CODE
// projectData: Returns given list in html format
// function projectData(data) {
//   return (
//     <div>
//       {data.map(item => {
//         return item
//       })}
//     </div>
//   );
// }
