import React, {Component} from 'react';
import {bool, string} from 'prop-types';

import styled from 'styled-components';

import palette from 'palette';

const Button = styled.button`
	background: #2d41a3;
	color: #fff;
	font-size: 18px;
	width: 100%;
	margin: 10px 20px 10px 0px;
	border: 0px;
	text-align: center;
	line-height: 50px;
	white-space: nowrap;
	/*border-radius: 5px;*/
`;

const Button2 = styled.button`
	background: #2d41a3;
	color: #fff;
	font-size: 18px;
	width: 100%;
	margin: 10px 20px 10px 0px;
	border: 0px;
	text-align: center;
	line-height: 50px;
	white-space: nowrap;
	/*border-radius: 5px;*/
	/*display: none;*/
`;

const P = styled.p`
	color: #f31c21;
`;

// Based on react-facebook
// Automatically share image through pop-up window
export default class FacebookShare extends Component {
	static defaultProps = {
		textButton: 'Comparte en FB!',
		typeButton: 'button'
	};

	static propTypes = {
		isSafari: bool,
		title: string,
		image: string
	}

	componentDidMount() {
		const {image} = this.props;
	}

	handleClick() {
		return window.FB.ui({
			method: 'feed',
			link: 'https://julsgud.github.io/tpr-vonvon/#/',
		}, (response) => {
			// console.log(response);
		});
	}

	render() {
		const {typeButton, textButton} = this.props;

		if (this.props.isSafari) {
			return(
				<P> (☞ﾟヮﾟ)☞ Haz click en tu imagen para salvarla y compártela en Facebook! ☜(ﾟヮﾟ☜) </P>
			);
		} else {
			return(
				<Button type={typeButton} onClick={() => this.handleClick()}>
					{textButton}
				</Button>
			);
		}
	}
}