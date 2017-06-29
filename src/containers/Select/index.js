import React, {Component} from 'react';
import update from 'immutability-helper';

import ImageButton from 'components/ImageButton';

import {Row, Col} from 'react-flexbox-grid';
import Loading from 'react-loading';

import styled from 'styled-components';
import palette from 'palette';

const Img = styled.img`
	max-width: 100%;
	width: 200px;
`;

class Select extends Component {
	constructor(props) {
		super(props);

		this.state = {
			images: [],
			imageCounter: this.props.images.length,
			spinner: true,
			loading: false
		}

		this.handleClick = this.handleClick.bind(this);
		this.getImage = this.getImage.bind(this);
	}

	componentDidMount() {
		console.log('** 2 **: Mounted Select Component');
		this.requestImages();
	}

	componentDidUpdate() {
		this.requestImages();
	}

	requestImages() {
		if (this.props.ready && !this.state.loading) {
			this.setState({loading: true});
			for (let i = 0; i < this.props.images.length; i++) {
				this.getImage(i);
			}
		}
	}

	getImage(i) {
		return window.FB.api('/' + this.props.images[i] + '?fields=images', (response) => {
			let isPortrait = false;

			if (response.images[0].height > response.images[0].width) {
				isPortrait = true;
				this.setState({imageCounter: this.state.imageCounter-1});
			}

			if (!isPortrait) {
				let newState = update(this.state, {
					images: {$push: [response]}
				});
				this.setState(newState, () => {
					// console.log(this.state);
				});
			}
			
			if (this.state.images.length == this.state.imageCounter) {
				this.loadedAllImages();
			}
		}, {access_token: this.props.info.accessToken});
	}

	loadedAllImages() {
		this.setState({spinner: false});
		console.log('** loaded all images **');
	}

	getFirstName(name) {
		let str = name;
		let s;

		s = str.substr(0, str.indexOf(' '));

		return s;
	}

	handleClick(data) {
		this.props.selectionHandler(data);
		this.props.history.push('/process');
	}

	buildHeaderText() {
		let h;

		if (!this.props.errorMessage) {
			h = 'Hey ' + this.getFirstName(this.props.info.name) + ', escoge una foto donde se vea tu cara!';
		} else {
			h = this.props.errorMessage;
		}

		return h;
	}

	render() {
		let imageButtons = [];

		let headerText = this.buildHeaderText();

		if (this.state.spinner) {
			return(
				<Row center='xs'>
					<Col>
						<Loading type='bubbles' color={palette.red}/>
					</Col>
				</Row>
			);
		} else {

			for (let i = 0; i < this.state.images.length; i++) {
				imageButtons.push(<ImageButton key={i.toString()} img={this.state.images[i]} selectionCallback={this.handleClick}/>);
			};

			return(
				<Row center='xs'>
					<Col xs={12}>
						<h3> {headerText} </h3>
					</Col>
					<Row around='xs' middle='xs'>
						{imageButtons}
					</Row>
				</Row>
			);
		}
	}
}

Select.propTypes = {
	history: React.PropTypes.object
}

export default Select;