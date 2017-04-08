import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

import styled from 'styled-components';

import Header from 'components/Header';
import Footer from 'components/Footer';

import Home from 'containers/Home';
import Select from 'containers/Select';
import Process from 'containers/Process';

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
			userInfo: null,
			userImage: null
		};
		this.handleUserInfo = this.handleUserInfo.bind(this);
		this.handleImage = this.handleImage.bind(this);
		this.handleSelectedImage = this.handleSelectedImage.bind(this);
	}

	handleUserInfo(data) {
		let userInfo = data;
		this.setState({userInfo: userInfo});
		console.log(data);
	}

	handleImage(data) {
		let image = data;
		this.setState({userImage: image});
		console.log(image);
	}

	handleSelectedImage(data) {
		let selectedImage = data;
		this.setState({selectedImage: selectedImage});
		console.log(selectedImage);
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
									image={this.state.userImage}
									selectionHandler={this.handleSelectedImage}
									history={history}/>
							}/>
							<Route exact path='/process' render={({history}) => 
								<Process image={this.state.selectedImage}/>
							}/>
						</div>
					<Footer/>
				</AppWrapper>
			</Router>
		)
	}
}

export default App;