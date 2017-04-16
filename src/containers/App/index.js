import React, {Component} from 'react';
import {HashRouter as Router, Route, Link} from 'react-router-dom';
import styled from 'styled-components';

import {loadState, saveState} from 'localStorage.js';

import Header from 'components/Header';
import Footer from 'components/Footer';

import Home from 'containers/Home';
import Select from 'containers/Select';
import Process from 'containers/Process';
import Privacy from 'containers/Privacy';

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
		if (loadState()) {
			this.state = loadState();
			// console.log(this.state);
		} else {
			this.state = {
				userInfo: null,
				userImages: null,
				selectedImage: null,
			};
		}
		this.handleUserInfo = this.handleUserInfo.bind(this);
		this.handleImage = this.handleImage.bind(this);
		this.handleSelectedImage = this.handleSelectedImage.bind(this);
	}

	handleUserInfo(data) {
		let userInfo = data;
		this.setState({userInfo: userInfo}, () => {
			saveState(this.state)
		});
	}

	handleImage(data) {
		let images = data;
		this.setState({userImages: images}, () => {
			saveState(this.state);
		});
		console.log(this.state);
	}

	handleSelectedImage(data) {
		let image = {url: data};
		this.setState({selectedImage: image}, () => {
			saveState(this.state)
		});
		console.log(this.state);
	}

	render() {
		return (
			<Router>
				<AppWrapper>
					<Header/>
						<div>
							<Route exact path='/' render={({history}) => 
								<Home infoHandler={this.handleUserInfo} 
									imageHandler={this.handleImage} 
									history={history}/>
							}/>
							<Route exact path='/select' render={({history}) =>
								<Select info={this.state.userInfo} 
									images={this.state.userImages}
									selectionHandler={this.handleSelectedImage}
									history={history}/>
							}/>
							<Route exact path='/process' render={({history}) => 
								<Process image={this.state.selectedImage} user={this.state.userInfo}/>
							}/>
							<Route exact path='privacy' component={Privacy}/>
						</div>
					<Footer/>
				</AppWrapper>
			</Router>
		)
	}
}

export default App;