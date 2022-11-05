import React from 'react';
import './Projects.css';

/* Library Indices */

const IDX = 0;
const PROJ_NAME = 1;
const USERS = 3;
const HW_SELECT = 4;
const HW_LIST = 5;

/* HW Indices */

const HW_VAL = 0;
const HW_CAP = 1;

/* Components */

// Project: Displays the structure of the list of projects
class Projects extends React.Component {
	render() {
		return (
			<div className="project_wrap">
				<p className="project_title">
					Projects
				</p>
				<ProjectData
					curr_user={this.props.curr_user}
					curr_id={this.props.curr_id}
				/>
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
			/* User Information */
			curr_user: this.props.curr_user,,
			curr_id: this.props.curr_id,
			project_list: []
		};

		/* Add example data to library
		   Format: [Proj_idx, Proj_Name, Users, HW Selection, [HW1[val, cap], HW2[val, cap], ...]]
		*/
		this.state.project_list.push([0, "Project 0", "jwy7", ["User 1", "User 2", "User 3", "User 5"], 0, [[50, 100], [30, 100]]])
		this.state.project_list.push([1, "Project 1", "asev", ["User 2"], 0, [[50, 100], [0, 100]]])
		this.state.project_list.push([2, "Project 2", "egse", ["User 3", "User 2"], 0, [[10, 50], [30, 50]]])
		this.state.project_list.push([3, "Project 3", "ohyo", ["User 4"], 0, [[50, 70], [30, 50]]])
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
				this.renderProject(project_data[IDX], project_data[PROJ_NAME], project_data[USERS], project_data[HW_LIST])
			);
		}

		/* output the fully formatted project library */
		return (
			<div>
				{new_project_list}
				<div className="empty_space" />
				{this.renderNewProject()}
				{this.renderJoinProject()}
			</div>
		)
	}

	/* functions */

	// renderProject: Create a single formatted project with given data
	renderProject(i, proj, usr, hw) {
		return (
			<Project
				key={i.toString()}  // "key" is recommended by console (don't use it much in project tho)
				idx={i}
				Name={proj}
				User={usr}
				HW={hw}
				onCheckInClick={() => this.handleCheckIn(i)}
				onCheckOutClick={() => this.handleCheckOut(i)}
				onHWSelection={() => this.handleHWSelection(i)} />
		)
	}

	// renderNewProject: Create template that prompts user to make new project
	renderNewProject() {
		return (
			<ProjectAdder onNewProjectClick={() => this.handleNewProject()} />
		)
	}

	renderJoinProject() {
		return (
			<ProjectJoiner onProjectJoinClick={() => this.handleProjectJoin()} />
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
	}

	// handleCheckIn: Add and display new values to interface
	handleCheckIn(i) {
		/* Get current list and hw selection index */
		const project_list = this.state.project_list.slice();

		/* Get input value (chk-in value) and make sure it's not empty */
		const check_in_val = document.getElementById("check_in:" + project_list[i][PROJ_NAME]).value;
		if(check_in_val !== "" && !isNaN(check_in_val)) {

			/* Get current value and capacity of hw selection */
			const hw_idx = project_list[i][HW_SELECT];
			const curr_hw_list = project_list[i][HW_LIST]
			const curr_val = curr_hw_list[hw_idx][HW_VAL];
			const curr_cap = curr_hw_list[hw_idx][HW_CAP];

			/* Make sure chk-in value doesn't go above capacity */
			if(curr_val + parseInt(check_in_val) <= curr_cap) {

				/* Add chk-in value to current value */
				project_list[i][HW_LIST][hw_idx][HW_VAL] += parseInt(check_in_val);

				/* Set chk-in values to state */
				this.setState({
					project_list: project_list
				});

				/* Clear input text fields */
				document.getElementById("check_in:" + project_list[i][PROJ_NAME]).value = "";
			}
		}
	}

	// handleCheckOut: Subtract and display new values to interface
	handleCheckOut(i) {
		/* Access current list and hw selection index */
		const project_list = this.state.project_list.slice();

		/* Make sure field is not empty */
		const check_out_val = document.getElementById("check_out:" + project_list[i][PROJ_NAME]).value;
		if(check_out_val !== "" && !isNaN(check_out_val)) {

			/* Get current value and capacity of hw selection */
			const hw_idx = project_list[i][HW_SELECT];
			const curr_hw_list = project_list[i][HW_LIST]
			const curr_val = curr_hw_list[hw_idx][HW_VAL];

			/* Make sure value doesn't go below zero */
			if(curr_val - parseInt(check_out_val) >= 0) {

				/* Subtract chk-out value from current value */
				curr_hw_list[hw_idx][HW_VAL] -= parseInt(check_out_val);

				/* Set chk-in values to state */
				this.setState({
					project_list: project_list
				});

				/* Clear input text fields */
				document.getElementById("check_out:" + project_list[i][1]).value = "";
			}
		}
	}

	// handleNewProject: Add new HWSet to The data of the library
	handleNewProject() {
		/* Get the new project info and make sure they are non-empty strings */
		const project_name = document.getElementById("new_project_name").value;
		const project_id = document.getElementById("new_project_id").value;
		if(typeof project_name === 'string' && typeof project_id === 'string') {
			if(project_name.trim() !== '' && project_id.trim() !== '') {

				/* Get state push the new data into it */
				const project_list = this.state.project_list.slice();
				const user_list = []
				console.log(this.state.curr_user);
				user_list.push(this.state.curr_user)
				project_list.push([project_list.length, project_name, project_id, user_list, 0, [[100, 100], [100, 100]]]);

				/* Set list with additional project data to state */
				this.setState({
					project_list: project_list,
				})

				/* Clear input text fields */
				document.getElementById("new_project_name").value = "";
				document.getElementById("new_project_id").value = "";
			}
		}
	}

	// handleProjectJoin: Search for project in database and join if possible
	handleProjectJoin() {
		/* Get the new project info and make sure they are non-empty strings */
		const project_name = document.getElementById("existing_project_name").value;
		const project_id = document.getElementById("existing_project_id").value;
		console.log("Looking for", project_name, "with id:", project_id); ////////////////////////////////////
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
<<<<<<< HEAD:frontend/src/Projects.js
				<div className="registered_user_list">
					{/* figure out a way to display this automatically */}
					{Registered_Users(props.Users)}
				</div>
=======
				<p className="registered_users">
					{props.User} <br />	{/* look into marquee, div with scroll bar */}
					{props.User} <br />
					{props.User} <br />
					{props.User} <br />
					{props.User} <br />
					{props.User}
				</p>
>>>>>>> main:frontend/Projects.js
			</div>
			{/* Sets available */}
			<div className="project_column">
				<p className="hw_description">
					HWSet1: {props.HW[0][0]}/{props.HW[0][1]}
				</p>
				<p className="hw_description">
					HWSet2: {props.HW[1][0]}/{props.HW[1][1]}
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
					placeholder="Enter Value" />
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
					placeholder="Enter Value" />
				<button className="check_btn"
					type="button"
					onClick={props.onCheckOutClick} >
					Check Out
				</button>
			</div>
			{/* Join or Leave */}
			{/* <div className="project_column">
				<button
					className="join_btn"
					type="button" >
					Join
				</button>
			</div> */}
		</div>
	)
}

<<<<<<< HEAD:frontend/src/Projects.js
// Registered_Users: Creates user list to HTML (Project helper function)
function Registered_Users(users) {
	/* Make HTML format for users */
	const curr_user_list = []

	/* Push data as formatted project to html list */
	for(let i = 0; i < users.length; i++) {
		// console.log(users[i])
		curr_user_list.push(
			<p className="registered_user" key={i}>
				{users[i]}
			</p>
		)
	}

	/* Return the HTML format */
	return curr_user_list;
}

=======
>>>>>>> main:frontend/Projects.js
// ProjectAdder: HTML that gives the user the option to add a project to the library
function ProjectAdder(props) {
	return (
		<div className="project">
			{/* Title */}
			<div className="new_project_column">
				<input className="new_project_input"
					id="new_project_name"
					type="text"
					placeholder="Enter Project Name" />
			</div>
			{/* Users with Access */}
			<div className="new_project_column">
				<input className="new_project_input"
					id="new_project_id"
					type="text"
					placeholder="Enter Project ID" />
			</div>
			{/* Add Project */}
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

function ProjectJoiner(props) { {/* ////////////////////////////////////// NEWLY ADDED //////////////*/}
	return (
		<div className="project">
			{/* Title */}
			<div className="new_project_column">
				<input className="new_project_input"
					id="existing_project_name"
					type="text"
					placeholder="Existing Project Name" />
			</div>
			{/* Users with Access */}
			<div className="new_project_column">
				<input className="new_project_input"
					id="existing_project_id"
					type="text"
					placeholder="Existing Project ID" />
			</div>
			{/* Join or Leave */}
			<div className="new_project_column">
				<button
					className="join_project_btn"
					type="button"
					onClick={props.onProjectJoinClick} >
					Join
				</button>
			</div>
			{/* <div className="new_project_column">
				<button
					className="add_project_btn"
					type="button"
					onClick={props.onNewProjectClick} >
					Add Project
				</button>
			</div> */}
		</div>
	)
}

export {Projects};
