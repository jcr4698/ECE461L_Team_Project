import React from 'react';
import './App.css';

// App: Function that runs Project
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Projects/>
      </header>
    </div>
  );
}

export default App;

// Project: Displays the list of projects to page
class Projects extends React.Component {
  render() {
    return(
      <div className="projectWrap">
        <p className="projectTitle">Projects</p>
          <ProjectData />
          <div className="emptySpace"/>
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
      currProjectName: "",
      currProjectUser: "",
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
        <div className="emptySpace"/>
        {this.renderNewProject()}
      </div>
    )
  }

  //// Handlers

  // Change between HWSet 1 and HWSet 2 settings
  handleHWSelection(i) {
    const project_list = this.state.project_list.slice();
    var currHWSelection = parseInt(document.getElementById("hwset:"+project_list[i][1]).value);
    project_list[i][3] = currHWSelection;
    this.setState({
      project_list: project_list
    })
    this.handleCheckInValue(document.getElementById("checkIn:"+project_list[i][1]).value, i);
    this.handleCheckOutValue(document.getElementById("checkOut:"+project_list[i][1]).value, i);
  }

  // Add and display new values to interface
  handleCheckIn(i) {
    const project_list = this.state.project_list.slice();
    const checkInVal = document.getElementById("checkIn:"+project_list[i][1]).value;
    const hwIdx = project_list[i][3];
    if(checkInVal !== "") {
      if(project_list[i][4 + 2*hwIdx][0] + project_list[i][4 + 2*hwIdx][1] <= project_list[i][4 + 2*hwIdx + 1]) {
        project_list[i][4 + 2*hwIdx][0] += project_list[i][4 + 2*hwIdx][1];
        project_list[i][4 + 2*hwIdx][1] = 0;
        this.setState({
          project_list: project_list
        });
        document.getElementById("checkIn:"+project_list[i][1]).value = "";
      }
    }
  }

  // Update value to add before Check-In
  handleCheckInValue(val, i) {
    var newCheckInValue = parseInt(val);
    if(!isNaN(newCheckInValue)) {
      const project_list = this.state.project_list.slice();
      const hwIdx = project_list[i][3];
      project_list[i][4 + 2*hwIdx][1] = newCheckInValue;
      this.setState({
        project_list: project_list
      })
    }
  }

  // Subtract and display new values to interface
  handleCheckOut(i) {
    const project_list = this.state.project_list.slice();
    const checkOutVal = document.getElementById("checkOut:"+project_list[i][1]).value;
    const hwIdx = project_list[i][3];
    if(checkOutVal !== "") {
      if(project_list[i][4 + 2*hwIdx][0] - project_list[i][4 + 2*hwIdx][2] >= 0) {
        project_list[i][4 + 2*hwIdx][0] -= project_list[i][4 + 2*hwIdx][2];
        project_list[i][4 + 2*hwIdx][2] = 0;
        this.setState({
          project_list: project_list
        });
        document.getElementById("checkOut:"+project_list[i][1]).value = "";
      }
    }
  }

  // Update value to subtract before Check-In
  handleCheckOutValue(val, i) {
    var newCheckInValue = parseInt(val);
    if(!isNaN(newCheckInValue)) {
      const project_list = this.state.project_list.slice();
      const hwIdx = project_list[i][3];
      project_list[i][4 + 2*hwIdx][2] = newCheckInValue;
      this.setState({
        project_list: project_list
      })
    }
  }

  // Add new HWSet to Data
  handleNewProject() {
    const projectName = this.state.currProjectName;
    const projectUser = this.state.currProjectUser;
    if(typeof projectName === 'string' && typeof projectUser === 'string') {
      if(projectName.trim() !== '' && projectUser.trim() !== '') {
        const project_list = this.state.project_list.slice();
        project_list.push([project_list.length, projectName, projectUser, 0, [50, 0, 0], 100, [30, 0, 0], 50]);
        this.setState({
          project_list: project_list,
        })
        document.getElementById("newProjectName").value = "";
        document.getElementById("newProjectUser").value = "";
      }
    }
  }

  // Update value of current new project name
  handleNewProjectName() {
    var newProjectName = document.getElementById("newProjectName").value;
    this.setState({
      currProjectName: newProjectName
    })
  }

  // Update value of current user
  handleNewProjectUser() {
    var newProjectUser = document.getElementById("newProjectUser").value;
    this.setState({
      currProjectUser: newProjectUser
    })
  }

}

// Project: Format Project with props given
function Project(props) {
  return(
    <div className="project">
        {/* Title */}
        <div className="column">
          <p className="projectName">{props.Name}</p>
        </div>
        {/* Users with Access */}
        <div className="column">
          <p className="user">{props.User}</p>
        </div>
        {/* Sets available */}
        <div className="column">
          <p className="hwDescription">HWSet1: {props.HWSet1_Availability}/{props.HWSet1_Capacity}</p>
          <p className="hwDescription">HWSet2: {props.HWSet2_Availability}/{props.HWSet2_Capacity}</p>
        </div>
        {/* Select HW */}
        <div className="column">
          <p className="hwDescription">Select HWSet:</p>
          <select className="hwSelect"
                  id={"hwset:"+props.Name}
                  name="hwset"
                  onChange={props.onHWSelection}
          >
            <option value="0">HWSet 1</option>
            <option value="1">HWSet 2</option>
          </select>
        </div>
        {/* Check In */} 
        <div className="column">
          <input className="hwInput"
                 id={"checkIn:"+props.Name}
                 type="text"
                 placeholder="Enter Value"
                 onChange={(e) => props.onCheckInValue(e)}
          />
          <button className="checkBtn"
                  type="button"
                  onClick={props.onCheckInClick}
          >
            Check In
          </button>
        </div>
        {/* Check Out */}
        <div className="column">
          <input className="hwInput"
                 id={"checkOut:"+props.Name}
                 type="text"
                 placeholder="Enter Value"
                 onChange={(e) => props.onCheckOutValue(e)}
          />
          <button className="checkBtn"
                  type="button"
                  onClick={props.onCheckOutClick}
          >
            Check Out
          </button>
        </div>
        {/* Join or Leave */}
        <div className="column">
          <button className="joinBtn"
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
      <div className="newProjectColumn">
        <input className="newProjectInput"
               id="newProjectName"
               type="text"
               placeholder="Enter Project Name"
               onChange={props.onNewProjectName}
        />
      </div>
      {/* Users with Access */}
      <div className="newProjectColumn">
        <input className="newProjectInput"
               id="newProjectUser"
               type="text"
               placeholder="Enter User Name"
               onChange={props.onNewProjectUser}
        />
      </div>
      {/* Join or Leave */}
      <div className="newProjectColumn">
        <button className="addProjectBtn" type="button" onClick={props.onNewProjectClick}>Add Project</button>
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
