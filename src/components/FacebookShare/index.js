import React, {Component} from 'react';

import styled from 'styled-components';

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

export default class FacebookShare extends Component {
	static defaultProps = {
		textButton: 'Comparte tu foto en FB! ;)',
		typeButton: 'button'
	}

	componentDidMount() {
		const {image} = this.props;


	}

	click(image) {
		// window.URL = window.URL || window.webkitURL;
		// const imgUrl = window.URL.createObjectURL(image);

		return window.FB.ui({
			method: 'feed',
			name: this.props.title,
			link: 'https://tprvonvon.com/',
			caption: 'The Plastics Revolution ~(˘▾˘~)',
			description: 'Y tu a cuál de los #SeresExtraordinarios te pareces?!',
			tags: ['#SeresExtraordinarios', '#ThePlasticsRevolution', '#TPRVONVON'],
			picture: this.props.image
		}, (response) => {
			console.log(response);
		});
	}

	render() {
		const {typeButton, textButton} = this.props;

		return(
			<Button type={typeButton} onClick={this.click()}>
				{textButton}
			</Button>
		);
	}
}