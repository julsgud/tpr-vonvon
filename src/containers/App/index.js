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

import cloudinary from 'cloudinary';

const AppWrapper = styled.div`
	font-family: 'Calibre-Bold', sans-serif;
	color: #282828;
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

		// Load state from local storage if available
		if (loadState()) {
			let user = loadState();
			this.state = {
				user: user,
				isSdkLoaded: false,
				music: 'spotify:track:1t5ZZxitYzzka5BisJLVXf'
			}
		} else {
			this.state = {
				user: {
					info: null,
					images: null,
					selection: null
				},
				isSdkLoaded: false,
				errorMessage: null,
				music: 'spotify:track:1t5ZZxitYzzka5BisJLVXf'
			};
		}

		this.handleUserInfo = this.handleUserInfo.bind(this);
		this.handleImages = this.handleImages.bind(this);
		this.handleSelectedImage = this.handleSelectedImage.bind(this);
		this.handleError = this.handleError.bind(this);
		this.handleSong = this.handleSong.bind(this);
	}

	// Setup FB SDK
	// More info --> https://developers.facebook.com/quickstarts/1418273384901709/?platform=web
	componentWillMount() {
		if (document.getElementById('facebook-jssdk')) {
			this.sdkLoaded();
			return;
		}
		this.setFbAsyncInit();
		this.initCloudinary();
		this.loadSdkAsynchronously();
		let fbRoot = document.getElementById('fb-root');
		if (!fbRoot) {
			fbRoot = document.createElement('div');
			fbRoot.id = 'fb-root';
			document.body.appendChild(fbRoot);
		}
	}

	// Cloudinary API config
	// Great free image storage/manipulation service.
	initCloudinary() {
		cloudinary.config({
			cloud_name: 'julsgc',
			api_key: '794939881876669',
			api_secret: 'RRNCr0MJmmca-Lf4i9A2CoNuxZ4'
		});
	}

	// Fb init options
	setFbAsyncInit() {
		const appId = '1418273384901709';
		window.fbAsyncInit = () => {
			window.FB.init({
				version: '2.8',
				appId: appId,
				xfbml: true
			});
			this.sdkLoaded();
			window.FB.getLoginStatus(this.checkLoginAfterRefresh);
		};
	}

	checkLoginAfterRefresh(response) {
		if (response.status === 'connected') {
			console.log('** Already connected to FB **');
		}
	}

	loadSdkAsynchronously() {
		((d, s, id) => {
	      const element = d.getElementsByTagName(s)[0];
	      const fjs = element;
	      let js = element;
	      if (d.getElementById(id)) { return; }
	      js = d.createElement(s); js.id = id;
	      js.src = `//connect.facebook.net/es_LA/all.js`;
	      fjs.parentNode.insertBefore(js, fjs);
	    })(document, 'script', 'facebook-jssdk');
	}

	sdkLoaded() {
		this.setState({isSdkLoaded: true});
	}

	// Save user info to state
	handleUserInfo(data) {
		let info = data;
		let newState = update(this.state, {
			user: {info: {$set: info}}
		});
		this.setState(newState, () => {
			saveState(this.state.user);
		});
	}

	// Save images to state
	handleImages(data) {
		let images = data;
		let newState = update(this.state, {
			user: {images: {$set: images}}
		});
		this.setState(newState, () => {
			saveState(this.state.user);
		});
	}

	// Save selected image to state
	handleSelectedImage(data) {
		let selection = data;
		let newState = update(this.state, {
			user: {selection: {$set: selection}}
		});
		this.setState(newState, () => {
			saveState(this.state.user);
		});
	}

	// Save error to state to display on image reselection
	handleError(data) {
		let error = data;
		let newState = update(this.state, {
			errorMessage: {$set: error}
		});
		this.setState(newState);
	}

	// Save selected song info to state
	handleSong(data) {
		let music = data;
		let newState = update(this.state, {
			music: {$set: music}
		});
		this.setState(newState);
	}

	render() {
		return (
			<Router>
				<AppWrapper>
					<Header sdkLoaded={this.state.isSdkLoaded}/>
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
									songHandler={this.handleSong}
									errorHandler={this.handleError} 
									history={history}
								/>
							}/>
						</div>
					<Footer playThis={this.state.music}/>
				</AppWrapper>
			</Router>
		)
	}
}

export default App;