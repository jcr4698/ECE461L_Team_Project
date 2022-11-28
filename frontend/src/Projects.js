import React from 'react';
import './Projects.css';

/* Library Indices */

const IDX = 0;
const PROJ_NAME = 1;
const PROJ_ID = 2;
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
			<div>
				<LogoutUser
					onLogoutClick={() => this.handleLogout()}
				/>
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
			</div>

		)
	}

	/* Handlers */

	// handleLogin: Determine whether a valid account is entered
    handleLogout() {
		console.log("logging out...");
		this.props.handleLogoutStatus();
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
			curr_hw1: [0, 0],
			curr_hw2: [0, 0],
			project_list: [],
			proj_desc: ""
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

			/* Get projects */
			const data = JSON.parse(JSON.stringify(respJson));
			const projects = data["Projects"];
			console.log(projects);
			for(let proj in projects) {	// API Should return all projects associated with user_id
				console.log(projects[proj]);	// Test out projects are actually send
				proj_list.push(projects[proj]);	// Then, make sure to format the data for the frontend
			}

			/* Get hw sets */
			const hw_set_1 = data["HW1"];
			const hw_set_2 = data["HW2"];

			/* Set state of frontend */
			this.setState({
				project_list: proj_list,
				curr_hw1: hw_set_1,
				curr_hw2: hw_set_2
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

			/* Project in HTML format for library */
			new_project_list.push(
				this.renderProject(project_data[IDX], project_data[PROJ_NAME], project_data[USERS], project_data[HW_LIST])
			);
		}

		/* output the fully formatted project library */
		return (
			<div>
				<RefreshUser
					onRefreshClick={() => this.handleRefresh()}
				/>
				{this.renderHWSets(this.state.curr_hw1, this.state.curr_hw2)}
				<div className="empty_space" />
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

	// renderHWSets: Format the hardware sets available and the capacity
	renderHWSets(hw1, hw2) {
		return (
			<div>
				<div className="hardware_sets">
					<div className="hw_column">
						<p className="hw_description">
							HWSet1:
						</p>
						<p className="hw_description">
							{hw1[0]}/{hw1[1]}
						</p>
					</div>
				</div>
				<div className="hardware_sets">
					<div className="hw_column">
						<p className="hw_description">
							HWSet2:
						</p>
						<p className="hw_description">
							{hw2[0]}/{hw2[1]}
						</p>
					</div>
				</div>
			</div>
		)
	}

	// renderProject: Create a single formatted project with given data
	renderProject(i, proj, usr, hw) {
		return (
			<Project
				key={i.toString()}  // "key" is recommended by console (don't use it much in project tho)
				idx={i}
				Name={proj}
				Users={usr}
				HW={hw}
				onMoreInfoClick={() => this.handleMoreInfo(i)}
				onCheckInClick={() => this.handleCheckIn(i)}
				onCheckOutClick={() => this.handleCheckOut(i)}
				onHWSelection={() => this.handleHWSelection(i)}
				onProjectLeave={() => this.handleProjectLeave(i)} />
		)
	}

	// renderNewProject: Create template that prompts user to make new project
	renderNewProject() {
		return (
			<ProjectAdder onNewProjectClick={() => this.handleNewProject()} />
		)
	}

	// renderJoinProject: Create template that prompts user for project id to join
	renderJoinProject() {
		return (
			<ProjectJoiner onProjectJoinClick={() => this.handleProjectJoin()} />
		)
	}

	/* Handlers */

	// handleRefresh: Update the projects in the project library
	handleRefresh() {
		console.log("refreshing...");
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

			/* Get projects */
			const data = JSON.parse(JSON.stringify(respJson));
			const projects = data["Projects"];
			console.log(projects);
			for(let proj in projects) {	// API Should return all projects associated with user_id
				console.log(projects[proj]);	// Test out projects are actually send
				proj_list.push(projects[proj]);	// Then, make sure to format the data for the frontend
			}

			/* Get hw sets */
			const hw_set_1 = data["HW1"];
			const hw_set_2 = data["HW2"];

			/* Set state of frontend */
			this.setState({
				project_list: proj_list,
				curr_hw1: hw_set_1,
				curr_hw2: hw_set_2
			});
		});
	}

	// handleHWSelection: Alert the description of the project chosen
	handleMoreInfo(i){
		//alert("Insert User-Inputted Project Description Here")
		const project_list = this.state.project_list.slice()
		/* Obtain data fetched from route into library */
		fetch("/get_project_description", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				proj_desc: "",
				proj_id: project_list[i][PROJ_ID]
			})
		})
		.then(response => response.json())
		.then(respJson => {
			const description = JSON.parse(JSON.stringify(respJson));
			alert("PROJECT DESCRIPTION: " + description["project_description"]);
			this.setState({
				proj_desc: description["project_description"]
			})
		});
	}

	// handleHWSelection: Update hw selection value when selection has changed
	handleHWSelection(i) {
		/* Get and modify the hw selection index */
		const project_list = this.state.project_list.slice();
		// console.log(project_list);
		var curr_hw_selection = parseInt(document.getElementById("hw_set:" + project_list[i][PROJ_NAME]).value);
		project_list[i][HW_SELECT] = curr_hw_selection;
		console.log(curr_hw_selection);

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
			const proj_id = project_list[i][PROJ_ID];
			const proj_hw_idx = project_list[i][HW_SELECT];

			/* Obtain data fetched from route into library */
			fetch("/check_in", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					proj_id: proj_id,
					hw_set: proj_hw_idx,
					check_val: parseInt(check_in_val),
					user_id: this.state.curr_id,
				})
			})
			.then(response => response.json())
			.then(respJson => {

				/* Get hw data */
				const data = JSON.parse(JSON.stringify(respJson));

				/* Get hw sets */
				const hw_set_1 = data["HW1"];
				const hw_set_2 = data["HW2"];

				console.log(hw_set_1);
				console.log(hw_set_2);

				/* Set state of frontend */
				this.setState({
					curr_hw1: hw_set_1,
					curr_hw2: hw_set_2
				});

				document.getElementById("check_in:" + project_list[i][PROJ_NAME]).value = "";

			});
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
			const proj_id = project_list[i][PROJ_ID];
			const proj_hw_idx = project_list[i][HW_SELECT];

			/* Obtain data fetched from route into library */
			fetch("/check_out", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					proj_id: proj_id,
					hw_set: proj_hw_idx,
					check_val: parseInt(check_out_val),
					user_id: this.state.curr_id
				})
			})
			.then(response => response.json())
			.then(respJson => {

				/* Get hw data */
				const data = JSON.parse(JSON.stringify(respJson));

				/* Get hw sets */
				const hw_set_1 = data["HW1"];
				const hw_set_2 = data["HW2"];

				console.log(hw_set_1);
				console.log(hw_set_2);

				/* Set state of frontend */
				this.setState({
					curr_hw1: hw_set_1,
					curr_hw2: hw_set_2
				});

				document.getElementById("check_out:" + project_list[i][PROJ_NAME]).value = "";

			});
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

				/* Add additional users */
				const list_input = document.getElementById("new_project_users").value;
				if(typeof list_input == 'string' && list_input.trim() !== '') {
					const users_arr = list_input.split(",").map(String);
					for(let i = 0; i < users_arr.length; i++) {
						const auth_user = users_arr[i].trim();
						if(auth_user !== '') {
							user_list.push(auth_user);
						}
					}
				}
				const proj_desc = document.getElementById("new_project_description").value;

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
										1
									],
						proj_desc: proj_desc
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
						project_list.push([project_list.length, project_name, project_id, user_list, 1, [[100, 100], [100, 100]]]);

						/* Set list with additional project data to state */
						this.setState({
							project_list: project_list
						})

						/* Clear input text fields */
						document.getElementById("new_project_name").value = "";
						document.getElementById("new_project_id").value = "";
						document.getElementById("new_project_description").value = "";
						document.getElementById("new_project_users").value = "";
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

				/* Open json response */
				const data = JSON.parse(JSON.stringify(respJson));

				/* Update Project List */
				if(data["Status"]) {

					/* get project data */
					const proj_data = data["Project"]
					const project_name = proj_data[0]
					const user_list = proj_data[2]
					console.log(proj_data)
					console.log(user_list)
					project_list.push([
											project_list.length,
											project_name,
											project_id,
											"",
											user_list,
											1
										]);

					/* Set list with additional project data to state */
					this.setState({
						project_list: project_list
					})

					/* Clear input text fields */
					document.getElementById("new_project_name").value = "";
					document.getElementById("new_project_id").value = "";
				}
				else {
					alert("Project ID doesn't exists in database, or already part of it.")
				}
			});
		}

	}

	handleProjectLeave(i) {
		/* list format to be stored */
		const proj_list = [];

		/* Get current list and hw selection index */
		const project_list = this.state.project_list.slice();

		/* Get the new project info and make sure they are non-empty strings */
		const project_id = project_list[i][PROJ_ID];

		/* Attempt adding project to json */
			fetch("/project_leave", {
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

				/* Open json response */
				const data = JSON.parse(JSON.stringify(respJson));

				/* Update Project List */
				if(data["Status"]) {

					/* Get projects */
					const projects = data["Projects"];
					console.log(projects);
					for(let proj in projects) {	// API Should return all projects associated with user_id
						console.log(projects[proj]);	// Test out projects are actually send
						proj_list.push(projects[proj]);	// Then, make sure to format the data for the frontend
					}

					/* Get hw sets */
					const hw_set_1 = data["HW1"];
					const hw_set_2 = data["HW2"];

					/* Set state of frontend */
					this.setState({
						project_list: proj_list,
						curr_hw1: hw_set_1,
						curr_hw2: hw_set_2
					});
				}
				else {
					alert("Project ID doesn't exists in database.")
				}
			});
	}

}

/* HTML */

// LogoutUser: HTML that prompts user to log-out
function LogoutUser(props) {
	return (
		<button
			className="logout_btn"
			type="button"
			onClick={props.onLogoutClick} >
			logout
		</button>
	)
}

// RefreshUser: HTML that prompts user to refresh
function RefreshUser(props) {
	return (
		<button
			className="refresh_btn"
			type="button"
			onClick={props.onRefreshClick} >
			refresh
		</button>
	)
}

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
					{Registered_Users(props.Users)}
				</div>
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
					<option value="1">
						HWSet 1
					</option>
					<option value="2">
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
			{/* Project Description */}
			<div className="project_column">
				<button className="join_btn"
					type="button"
					onClick={props.onMoreInfoClick} >
					More Info
				</button>
			</div>
			{/* Join or Leave */}
			<div className="project_column">
				<button className="join_btn"
					id={"leave:" + props.Name}
					type="button"
					onClick={props.onProjectLeave}>
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
		<div className="new_project">
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
				<button className="add_project_btn"
					type="button"
					onClick={props.onNewProjectClick} >
					Add Project
				</button>
			</div>
			{/* Users */}
			<div className="new_project_description">
				<input className="project_description"
					id="new_project_users"
					type="text"
					placeholder="Enter Authorized Users (Separated by a comma)" />
			</div>
			{/* Description */}
			<div className="new_project_description">
				<input className="project_description"
					id="new_project_description"
					type="text"
					placeholder="Enter Project Description" />
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
		</div>
	)
}

export {Projects};
