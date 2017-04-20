import React, {Component} from 'react';
import {HashRouter as Router, Route, Link} from 'react-router-dom';
import update from 'immutability-helper';
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
	min-height: 100%;
  	margin: 0 auto;
  	display: flex;
  	height: 100%;
  	flex-direction: column;
`;

class App extends Component {
	constructor() {
		super();

		if (loadState()) {
			let user = loadState();
			this.state = {
				user: user,
				isSdkLoaded: false
			}
			console.log('** 0 **: State Reloaded');
			// console.log(this.state.user);
		} else {
			this.state = {
				user: {
					info: null,
					images: null,
					selection: null
				},
				isSdkLoaded: false,
				errorMessage: null
			};
		}

		this.handleUserInfo = this.handleUserInfo.bind(this);
		this.handleImages = this.handleImages.bind(this);
		this.handleSelectedImage = this.handleSelectedImage.bind(this);
		this.handleError = this.handleError.bind(this);
	}

	componentWillMount() {
		if (document.getElementById('facebook-jssdk')) {
			this.sdkLoaded();
			return;
		}
		this.setFbAsyncInit();
		this.loadSdkAsynchronously();
		let fbRoot = document.getElementById('fb-root');
		if (!fbRoot) {
			fbRoot = document.createElement('div');
			fbRoot.id = 'fb-root';
			document.body.appendChild(fbRoot);
		}
	}

	setFbAsyncInit() {
		const appId = '1418273384901709';
		window.fbAsyncInit = () => {
			window.FB.init({
				version: '2.8',
				appId
			});
			this.sdkLoaded();
			window.FB.getLoginStatus(this.checkLoginAfterRefresh);
			};
		}

	checkLoginAfterRefresh(response) {
		if (response.status === 'connected') {
			console.log('** connected to FB **');
		} else {
			// redirect to home for reconnection
			// window.FB.login((loginResponse) => {
			// 	console.log(loginResponse);
			// });
		}
	}

	loadSdkAsynchronously() {
		((d, s, id) => {
	      const element = d.getElementsByTagName(s)[0];
	      const fjs = element;
	      let js = element;
	      if (d.getElementById(id)) { return; }
	      js = d.createElement(s); js.id = id;
	      js.src = `//connect.facebook.net/en_US/all.js`;
	      fjs.parentNode.insertBefore(js, fjs);
	    })(document, 'script', 'facebook-jssdk');
	}

	sdkLoaded() {
		this.setState({isSdkLoaded: true});
		console.log('** fb-sdk loaded ** ');
	}

	componentDidMount() {
		console.log('** 1 **: Mounted App Component');
	}

	handleUserInfo(data) {
		let info = data;
		let newState = update(this.state, {
			user: {info: {$set: info}}
		});
		this.setState(newState, () => {
			saveState(this.state.user);
		});
		console.log('* User info updated *');
	}

	handleImages(data) {
		let images = data;
		let newState = update(this.state, {
			user: {images: {$set: images}}
		});
		this.setState(newState, () => {
			saveState(this.state.user);
		});
		console.log('* User images updated *');
	}

	handleSelectedImage(data) {
		let selection = data;
		let newState = update(this.state, {
			user: {selection: {$set: selection}}
		});
		this.setState(newState, () => {
			saveState(this.state.user);
		});
		console.log('* User selection updated *');
	}

	handleError(data) {
		let error = data;
		let newState = update(this.state, {
			errorMessage: {$set: error}
		});
		this.setState(newState);
	}

	render() {
		return (
			<Router>
				<AppWrapper>
					<Header/>
						<div>
							<Route exact path='/' render={({history}) => 
								<Home infoHandler={this.handleUserInfo} 
									imageHandler={this.handleImages} 
									history={history}/>
							}/>
							<Route exact path='/select' render={({history}) =>
								<Select 
									ready={this.state.isSdkLoaded}
									info={this.state.user.info} 
									images={this.state.user.images}
									errorMessage={this.state.errorMessage}
									selectionHandler={this.handleSelectedImage}
									history={history}/>
							}/>
							<Route exact path='/process' render={({history}) => 
								<Process 
									image={this.state.user.selection} 
									user={this.state.user.info}
									errorHandler={this.handleError} 
									history={history}
								/>
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