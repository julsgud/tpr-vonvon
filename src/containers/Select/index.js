import React, {Component} from 'react';
import axios from 'axios';

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
			images: null,
			loading: true
		}
	}

	componentDidMount() {
		for (let i = 0; i < this.props.images.length; i++) {
			return this.getImage(i);
		}
		this.state.loading = false;
	}

	getImage(i) {
		// return axios({
		// 	method: 'get',
		// 	url: 'https://graph.facebook.com/v2.8/' + this.props.images[i] + 'fields?=images&access_token=' + this.props.info.accessToken,
		// }).then((response) => {
		// 	console.log(response);
		// 	images[i]= {data: response}
		// 	return response;
		// });
		return window.FB.api('/' + this.props.images[i] + '?fields=images', (response) => {
			console.log(response);
		});
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

	render() {
		let imageButtons = [];

		// for (let i = 0; i < this.props.images.length; i++) {
		// 	imageButtons.push(<ImageButton src={this.props.images[i][0].source} selectionCallback={this.handleClick}/>);
		// }
		if (this.state.loading) {
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