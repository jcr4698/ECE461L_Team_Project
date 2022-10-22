import React from 'react';
import './Projects.css';

/* Components */

// Project: Displays the structure of the list of projects
class Projects extends React.Component {
	render() {
		return (
			<div className="project_wrap">
				<p className="project_title">
					Projects
				</p>
				<ProjectData />
				<div className="empty_space" />
			</div>
		)
	}
}

// Place data into a stored list
class ProjectData extends React.Component {

	// constructor: Initialize data
	constructor(props) {

		/* Current state of the library */
		super(props);
		this.state = {
			curr_project_name: "",
			curr_project_user: "",
			project_list: []
		};

		/* Add example data to library
		   Format:
		   [Proj_idx, Proj_Name, Users, HW Selection, HW1[val, chk-in, chk-out], HW1 Cap, HW2[val, chk-in, chk-out], HW2 Cap]
		*/
		this.state.project_list.push([0, "Project 0", "User 1", 0, [50, 0, 0], 100, [30, 0, 0], 100])
		this.state.project_list.push([1, "Project 1", "User 2", 0, [50, 0, 0], 100, [0, 0, 0], 100])
		this.state.project_list.push([2, "Project 2", "User 3", 0, [10, 0, 0], 50, [30, 0, 0], 50])
		this.state.project_list.push([3, "Project 3", "User 4", 0, [50, 0, 0], 70, [30, 0, 0], 50])
	}

	// render: Update page with the data stored
	render() {
		/* Create html list */
		const new_project_list = [];

		/* Get data from library */
		const project_list = this.state.project_list.slice();

		/* Push data as formatted project to html list */
		for(let i = 0; i < project_list.length; i++) {
			/* Get next project (data) */
			const project_data = project_list[i];

			/* Project in HTML format for library */
			new_project_list.push(
				this.renderProject(
					project_data[0],
					project_data[1],
					project_data[2],
					project_data[4],
					project_data[5],
					project_data[6],
					project_data[7]
				)
			);
		}

		/* output the fully formatted project library */
		return (
			<div>
				{new_project_list}
				<div className="empty_space" />
				{this.renderNewProject()}
			</div>
		)
	}

	/* functions */

	// renderProject: Create a single formatted project with given data
	renderProject(i, proj, usr, hw1_avail, hw1_cap, hw2_avail, hw2_cap) {
		return (
			<Project
				key={i.toString()}  // "key" is recommended by console (don't use it much in project tho)
				idx={i}
				Name={proj}
				User={usr}
				HWSet1_Availability={hw1_avail[0]}
				HWSet1_Capacity={hw1_cap}
				HWSet2_Availability={hw2_avail[0]}
				HWSet2_Capacity={hw2_cap}
				onCheckInValue={(e) => this.handleCheckInValue(e.target.value, i)}
				onCheckInClick={() => this.handleCheckIn(i)}
				onCheckOutValue={(e) => this.handleCheckOutValue(e.target.value, i)}
				onCheckOutClick={() => this.handleCheckOut(i)}
				onHWSelection={() => this.handleHWSelection(i)} />
		)
	}

	// renderNewProject: Create template that prompts user to make new project
	renderNewProject() {
		return (
			<ProjectAdder
				onNewProjectClick={() => this.handleNewProject()}
				onNewProjectName={() => this.handleNewProjectName()}
				onNewProjectUser={() => this.handleNewProjectUser()} />
		)
	}

	/* Handlers */

	// handleHWSelection: Update hw selection value when selection has changed
	handleHWSelection(i) {
		/* Get and modify the hw selection index */
		const project_list = this.state.project_list.slice();
		var curr_hw_selection = parseInt(document.getElementById("hw_set:" + project_list[i][1]).value);
		project_list[i][3] = curr_hw_selection;

		/* Set the hw selection index to state */
		this.setState({
			project_list: project_list
		})

		/* Update Check-in/out values in case selection changes */
		this.handleCheckInValue(document.getElementById("check_in:" + project_list[i][1]).value, i);
		this.handleCheckOutValue(document.getElementById("check_out:" + project_list[i][1]).value, i);
	}

	// handleCheckIn: Add and display new values to interface
	handleCheckIn(i) {
		/* Get current list and hw selection index */
		const project_list = this.state.project_list.slice();
		const hw_idx = project_list[i][3];

		/* Get input value (chk-in value) and make sure it's not empty */
		const check_in_val = document.getElementById("check_in:" + project_list[i][1]).value;
		if(check_in_val !== "") {

			/* Make sure chk-in value doesn't go above capacity */
			if(project_list[i][4 + 2 * hw_idx][0] + project_list[i][4 + 2 * hw_idx][1] <= project_list[i][4 + 2 * hw_idx + 1]) {

				/* Add chk-in value to current value */
				project_list[i][4 + 2 * hw_idx][0] += project_list[i][4 + 2 * hw_idx][1];

				/* Set chk-in value to zero */
				project_list[i][4 + 2 * hw_idx][1] = 0;

				/* Set chk-in values to state */
				this.setState({
					project_list: project_list
				});

				/* Clear input text fields */
				document.getElementById("check_in:" + project_list[i][1]).value = "";
			}
		}
	}

	// handleCheckInValue: Update chk-in value of the hw selection
	handleCheckInValue(val, i) {
		/* Get chk-in value (given) and make sure it's an integer */
		var new_check_in_value = parseInt(val);
		if(!isNaN(new_check_in_value)) {

			/* Get the hw selection */
			const project_list = this.state.project_list.slice();
			const hw_idx = project_list[i][3];

			/* Set the chk-in value to state (based on hw selection) */
			project_list[i][4 + 2 * hw_idx][1] = new_check_in_value;
			this.setState({
				project_list: project_list
			})
		}
	}

	// handleCheckOut: Subtract and display new values to interface
	handleCheckOut(i) {
		/* Access current list and hw selection index */
		const project_list = this.state.project_list.slice();
		const hw_idx = project_list[i][3];

		/* Make sure field is not empty */
		const check_out_val = document.getElementById("check_out:" + project_list[i][1]).value;
		if(check_out_val !== "") {

			/* Make sure value doesn't go below zero */
			if(project_list[i][4 + 2 * hw_idx][0] - project_list[i][4 + 2 * hw_idx][2] >= 0) {

				/* Subtract chk-out value from current value */
				project_list[i][4 + 2 * hw_idx][0] -= project_list[i][4 + 2 * hw_idx][2];
				project_list[i][4 + 2 * hw_idx][2] = 0;

				/* Set chk-in values to state */
				this.setState({
					project_list: project_list
				});

				/* Clear input text fields */
				document.getElementById("check_out:" + project_list[i][1]).value = "";
			}
		}
	}

	// handleCheckOutValue: Update chk-out value of the hw selection
	handleCheckOutValue(val, i) {
		/* Get chk-out value (given) and make sure it's an integer */
		var new_check_in_value = parseInt(val);
		if(!isNaN(new_check_in_value)) {

			/* Get the hw selection */
			const project_list = this.state.project_list.slice();
			const hw_idx = project_list[i][3];

			/* Set the chk-in value to state (based on hw selection) */
			project_list[i][4 + 2 * hw_idx][2] = new_check_in_value;
			this.setState({
				project_list: project_list
			})
		}
	}

	// handleNewProject: Add new HWSet to The data of the library
	handleNewProject() {
		/* Get the new project info and make sure they are non-empty strings */
		const project_name = this.state.curr_project_name;
		const project_user = this.state.curr_project_user;
		if(typeof project_name === 'string' && typeof project_user === 'string') {
			if(project_name.trim() !== '' && project_user.trim() !== '') {

				/* Get state push the new data into it */
				const project_list = this.state.project_list.slice();
				project_list.push([project_list.length, project_name, project_user, 0, [50, 0, 0], 100, [30, 0, 0], 50]);

				/* Set list with additional project data to state */
				this.setState({
					project_list: project_list,
				})

				/* Clear input text fields */
				document.getElementById("new_project_name").value = "";
				document.getElementById("new_project_user").value = "";
			}
		}
	}

	// handleNewProjectName: Update value of current new project name
	handleNewProjectName() {
		/* Save the current project name text input into a variable */
		var new_project_name = document.getElementById("new_project_name").value;

		/* Set project name to state */
		this.setState({
			curr_project_name: new_project_name
		})
	}

	// handleNewProjectName: Update value of current user
	handleNewProjectUser() {
		/* Save the current users text input into a variable */
		var new_project_user = document.getElementById("new_project_user").value;

		/* Set project users to state */
		this.setState({
			curr_project_user: new_project_user
		})
	}

}

/* HTML */

// Project: HTML that formats a single Project
function Project(props) {
	return (
		<div className="project">
			{/* Title */}
			<div className="project_column">
				<p className="project_name">
					{props.Name}
				</p>
			</div>
			{/* Users with Access */}
			<div className="project_column">
				<p className="user">
					{props.User}
				</p>
			</div>
			{/* Sets available */}
			<div className="project_column">
				<p className="hw_description">
					HWSet1: {props.HWSet1_Availability}/{props.HWSet1_Capacity}
				</p>
				<p className="hw_description">
					HWSet2: {props.HWSet2_Availability}/{props.HWSet2_Capacity}
				</p>
			</div>
			{/* Select HW */}
			<div className="project_column">
				<p className="hw_description">
					Select HWSet:
				</p>
				<select
					className="hw_select"
					id={"hw_set:" + props.Name}
					name="hwset"
					onChange={props.onHWSelection} >
					<option value="0">
						HWSet 1
					</option>
					<option value="1">
						HWSet 2
					</option>
				</select>
			</div>
			{/* Check In */}
			<div className="project_column">
				<input className="hw_input"
					id={"check_in:" + props.Name}
					type="text"
					placeholder="Enter Value"
					onChange={(e) => props.onCheckInValue(e)} />
				<button className="check_btn"
					type="button"
					onClick={props.onCheckInClick} >
					Check In
				</button>
			</div>
			{/* Check Out */}
			<div className="project_column">
				<input className="hw_input"
					id={"check_out:" + props.Name}
					type="text"
					placeholder="Enter Value"
					onChange={(e) => props.onCheckOutValue(e)} />
				<button className="check_btn"
					type="button"
					onClick={props.onCheckOutClick} >
					Check Out
				</button>
			</div>
			{/* Join or Leave */}
			<div className="project_column">
				<button
					className="join_btn"
					type="button" >
					Join
				</button>
			</div>
		</div>
	)
}

// ProjectAdder: HTML that gives the user the option to add a project to the library
function ProjectAdder(props) {
	return (
		<div className="project">
			{/* Title */}
			<div className="new_project_column">
				<input className="new_project_input"
					id="new_project_name"
					type="text"
					placeholder="Enter Project Name"
					onChange={props.onNewProjectName} />
			</div>
			{/* Users with Access */}
			<div className="new_project_column">
				<input className="new_project_input"
					id="new_project_user"
					type="text"
					placeholder="Enter Username"
					onChange={props.onNewProjectUser} />
			</div>
			{/* Join or Leave */}
			<div className="new_project_column">
				<button
					className="add_project_btn"
					type="button"
					onClick={props.onNewProjectClick} >
					Add Project
				</button>
			</div>
		</div>
	)
}

export {Projects};
