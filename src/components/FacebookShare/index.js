import React, {Component} from 'react';

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
	display: none;
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

export default class FacebookShare extends Component {
	static defaultProps = {
		textButton: 'Comparte en FB!',
		typeButton: 'button'
	}

	componentDidMount() {
		const {image} = this.props;
	}

	click() {
		// window.URL = window.URL || window.webkitURL;

		return window.FB.ui({
			method: 'feed',
			name: this.props.title,
			link: 'https://plasticsrev.club',
			caption: 'The Plastics Revolution ~(˘▾˘~)',
			description: 'Y tu a cuál de los #SeresExtraordinarios te pareces?!',
			tags: ['#SeresExtraordinarios', '#ThePlasticsRevolution', '#TPRVONVON'],
			picture: this.props.image
		}, (response) => {
			// console.log(response);
		});
	}

	render() {
		const {typeButton, textButton} = this.props;

		if (this.props.isSafari) {
			// console.log('saf');
			return(
				<P> (☞ﾟヮﾟ)☞ Descarga tu imagen y compártela en Facebook! ☜(ﾟヮﾟ☜) </P>
			);
		} else {
			// console.log('noSaf');
			return(
				<Button type={typeButton} onClick={this.click()}>
					{textButton}
				</Button>
			);
		}
	}
}