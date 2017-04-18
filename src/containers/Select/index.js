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

	getImageThumbnailUrl(index) {
		let url;

		// 1. retrieve current image object
		let img = this.state.images[index];

		// 2. find ~200px image in images array
		for (let i = 0; i < img.images.length; i++) {
			if (img.images[i].height <= 200 || img.images[i].width <= 200) {
				url = img.images[i].source;
				break;
			}
 		}
		
		return url;
	}

	render() {
		let imageButtons = [];

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
				imageButtons.push(<ImageButton key={i.toString()} index={i} src={this.getImageThumbnailUrl(i)} selectionCallback={this.handleClick}/>);
			};

			return(
				<Row center='xs'>
					<Col xs={12}>
						<H3> Hey {this.getFirstName(this.props.info.name)}, escoge una foto donde se vea tu cara! </H3>
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