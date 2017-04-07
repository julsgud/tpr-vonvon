import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

import styled from 'styled-components';

import Header from 'components/Header';
import Footer from 'components/Footer';

import Home from 'containers/Home';
import Select from 'containers/Select';

const AppWrapper = styled.div`
	font-family: 'Open Sans', sans-serif;
	width: 100%;
	max-width: calc(768px + 16px * 2);
  	margin: 0 auto;
  	display: flex;
  	height: 100%;
  	flex-direction: column;
`;

class App extends Component {
	constructor() {
		super();
		this.state = {
			userInfo: null
		};
		this.handleLogIn = this.handleLogIn.bind(this);
	}

	handleLogIn(data) {
		let userInfo = data;
		this.setState({userInfo: userInfo});
		console.log(data);
	}

	render() {
		return (
			<Router>
				<AppWrapper>
					<Header/>
						<div>
							<Route exact path='/' render={({history}) => 
								<Home handler={this.handleLogIn} history={history}/>
							}/>
							<Route exact path='/select' render={() =>
								<Select user={this.state.userInfo}/>
							}/>
						</div>
					<Footer/>
				</AppWrapper>
			</Router>
		)
	}
}

App.contextTypes = {
	router: React.PropTypes.object
};

export default App;