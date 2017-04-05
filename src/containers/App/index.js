import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

import styled from 'styled-components';

import Header from 'components/Header';
import Footer from 'components/Footer';

import Home from 'containers/Home';

const AppWrapper = styled.div`
	font-family: 'Open Sans', sans-serif;
	width: 100%;
	max-width: calc(768px + 16px * 2);
  	margin: 0 auto;
  	display: flex;
  	height: 100%;
  	flex-direction: column;
`;

export default class App extends Component {
	constructor() {
		super();
		this.state = {
			userInfo: {}
		};
		this.handleLogIn = this.handleLogIn.bind(this);
	}

	handleLogIn(data) {
		let userInfo = data;
		this.setState({userInfo: userInfo});
		console.log(this.state.userInfo);
	}

	render() {
		return (
			<AppWrapper>
				<Header/>
				<Router>
					<Route exact path='/' render={() => 
						<Home handler={this.handleLogIn}/>
					}/>
				</Router>
				<Footer/>
			</AppWrapper>
		)
	}
}