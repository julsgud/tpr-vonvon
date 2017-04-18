import React, {Component} from 'react';
import update from 'react-addons-update';

import ImageButton from 'components/ImageButton';

import {Row, Col} from 'react-flexbox-grid';
import Loading from 'react-loading';

import styled from 'styled-components';
import palette from 'palette';

const Img = styled.img`
	max-width: 100%;
	width: 200px;
`;

const H3 = styled.h3`
	color: ${palette.black};
`;

class Select extends Component {
	constructor(props) {
		super(props);

		this.state = {
			images: [],
			spinner: true,
			loading: false
		}
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
			// console.log(response);
			let newState = update(this.state, {
				images: {$push: [response]}
			});
			this.setState(newState);
			if (this.state.images.length == this.props.images.length) {
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
		// this.props.history.push('/process');
	}

	getImageThumbnail(images) {
		let url;
		
		
		
		return url;
	}

	render() {
		let imageButtons = [];

		for (let i = 0; i < this.state.images.length; i++) {
			// imageButtons.push(<ImageButton src={this.props.images[i][0].source} selectionCallback={this.handleClick}/>);
		}

		if (this.state.spinner) {
			return(
				<Row center='xs'>
					<Col>
						<Loading type='bubbles' color={palette.red}/>
					</Col>
				</Row>
			);
		} else {
			return(
				<Row center='xs'>
					<Col xs={12}>
						<H3> Hey {this.getFirstName(this.props.info.name)}, escoge una foto! </H3>
					</Col>
					<Col>
						{imageButtons}
					</Col>
				</Row>
			);
		}
	}
}

Select.propTypes = {
	history: React.PropTypes.object
}

export default Select;