import React from 'react';
import './Projects.css';

/* Library Indices */

const IDX = 0;
const PROJ_NAME = 1;
const DESC = 3;
const USERS = 4;
const HW_SELECT = 5;
const HW_LIST = 6;

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
					{this.props.curr_user}'s Projects
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

	// constructor: Store data into the state
	constructor(props) {

		/* Current state of the library */
		super(props);
		this.state = {
			/* User Information */
			curr_user: this.props.curr_user,
			curr_id: this.props.curr_id,
			project_list: []
		};

	}

	// componentDidMount: Initialize data from server into library
	componentDidMount() {
		/* list format to be stored */
		const proj_list = [];

		/* Obtain data fetched from route into library */
		fetch("/project_init", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				user_id: [this.props.curr_id]
			})
		})
		.then(response => response.json())
		.then(respJson => {
			const data = JSON.parse(JSON.stringify(respJson));
			const projects = data["Projects"]
			console.log(projects)
			for(let proj in projects) {	// API Should return all projects associated with user_id
				console.log(projects[proj]);	// Test out projects are actually send
				proj_list.push(projects[proj]);	// Then, make sure to format the data for the frontend
			}
			this.setState({
				project_list: proj_list
			});
		});
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

			console.log("users received: " + project_data);

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
				<div className="empty_space" />
				{this.renderJoinProject()}
				<div className="empty_space" />
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
				Users={usr}
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
		console.log(project_list);
		var curr_hw_selection = parseInt(document.getElementById("hw_set:" + project_list[i][1]).value);
		project_list[i][4] = curr_hw_selection;

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
				const user_list = [];
				user_list.push(this.state.curr_id);

				/* Attempt adding project to json */
				fetch("/project_add", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						user_id: this.props.curr_id,
						proj_id: project_id,
						proj_data: [
										project_list.length,
										project_name,
										project_id,
										user_list,
										0,
										[
											[100, 100],		// For now, it only adds 100 HW Sets
											[100, 100]
										]
									]
					})
				})
				.then(response => response.json())
				.then(respJson => {
					// console.log(project_id);
					const data = JSON.parse(JSON.stringify(respJson));
					console.log(data["Status"]);
			
					/* Update Project List */
					if(data["Status"]) {
						console.log("Project Added!");
						project_list.push([project_list.length, project_name, project_id, user_list, 0, [[100, 100], [100, 100]]]);

						/* Set list with additional project data to state */
						this.setState({
							project_list: project_list
						})

						/* Clear input text fields */
						document.getElementById("new_project_name").value = "";
						document.getElementById("new_project_id").value = "";
					}
					else {
						alert("Project ID already exists in database.")
					}
				});
			}
		}
	}

	// handleProjectJoin: Search for project in database and join if possible
	handleProjectJoin() {
		/* Get the new project info and make sure they are non-empty strings */
		const project_id = document.getElementById("existing_project_id").value;
		console.log("Looking for id:", project_id);

		if(typeof project_id === 'string' && project_id.trim() !== '') {

			const project_list = this.state.project_list.slice();

			/* Attempt adding project to json */
				fetch("/project_join", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						user_id: this.props.curr_id,
						proj_id: project_id
					})
				})
				.then(response => response.json())
				.then(respJson => {
					// console.log(project_id);
					const data = JSON.parse(JSON.stringify(respJson));
					console.log(data["Status"]);

					/* get project data */
					const proj_data = data["Project"]

					/* Update Project List */
					if(data["Status"]) {
						console.log("Joined Project");
						project_list.push([
												proj_data[0],
												proj_data[1],
												proj_data[2],
												proj_data[3],
												0,
												[
													[proj_data[5][0][0], proj_data[5][0][1]],
													[proj_data[5][1][0], proj_data[5][1][1]]
												]
											]);
						console.log(project_list)

						// /* Set list with additional project data to state */
						// this.setState({
						// 	project_list: project_list
						// })

						/* Clear input text fields */
						document.getElementById("new_project_name").value = "";
						document.getElementById("new_project_id").value = "";
					}
					else {
						alert("Project ID doesn't exists in database.")
					}
				});
		}

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
				<div className="registered_user_list">
					{/* figure out a way to display this automatically */}
					{Registered_Users(props.Users)}
				</div>
			</div>
			{/* Sets available */}
			{/*<div className="project_column">*/}
			{/*	<p className="hw_description">*/}
			{/*		HWSet1: {props.HW[0][0]}/{props.HW[0][1]}*/}
			{/*	</p>*/}
			{/*	<p className="hw_description">*/}
			{/*		HWSet2: {props.HW[1][0]}/{props.HW[1][1]}*/}
			{/*	</p>*/}
			{/*</div>*/}
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
			<div className="project_column">
				<button
					className="join_btn"
					type="button" >
					Leave
				</button>
			</div>
		</div>
	)
}

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

function ProjectJoiner(props) {
	return (
		<div className="project">
			{/* Title */}
			<div className="join_project_column">
				<p className="add_project_title">
					Join Existing Project:
				</p>
			</div>
			{/* Users with Access */}
			<div className="join_project_column">
				<input className="new_project_input"
					id="existing_project_id"
					type="text"
					placeholder="Project ID" />
			</div>
			{/* Join or Leave */}
			<div className="join_project_column">
				<button
					className="join_project_btn"
					type="button"
					onClick={props.onProjectJoinClick} >
					Join
				</button>
			</div>
			{/*
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
