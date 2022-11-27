import React from 'react';
import './App.css';
import {Login} from './Login';
import {Projects} from './Projects';

/* Components */

// App: Function that runs Project
class App extends React.Component {

	// constructor: Initialize state of page (Login or Projects Library page)
	constructor(props) {
		super(props)
		this.state = {
			is_logged_in: false
		}
	}

	// render: Update status of page
	render() {
		if(this.state.is_logged_in) {	// Projects Page (True)
			return (
				<div className="App">
					<header className="app_header">
						<Projects 
							curr_user={this.state.curr_user}
							curr_id={this.state.curr_id}
							handleLogoutStatus={this.handleLogoutStatus}
						/>
					</header>
				</div>
			)
		}
		else {	// Login Page (False)
			return (
				<div className="App">
					<header className="app_header">
						<Login
							handleLoginStatus={this.handleLoginStatus} />
					</header>
				</div>
			)
		}
	}

	/* Handlers */

	// handleLoginStatus: Updates log-in status based on Login Page
	handleLoginStatus = (logged_in, id, user) => {
		this.setState({
			curr_user: user,
			curr_id: id,
			is_logged_in: logged_in
		})
	}

	// handleLogoutStatus: Updates log-out status
	handleLogoutStatus = () => {
		this.setState({
			is_logged_in: false
		})
	}

}

export default App;

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
