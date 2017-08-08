import React from 'react';
import {Col} from 'react-flexbox-grid';
import styled from 'styled-components';

const Img = styled.img`
	max-height: 150px;
	max-width: 150px;
`;

const Button = styled.button`
	border: none;
	outline: none;
	background-color: Transparent;
	background-repeat: no-repeat;
	background-position: center center;
	margin: 0;
`;

class ImageButton extends React.Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {	
		this.props.selectionCallback(this.props.img);
	}

	getImageThumbnailUrl(img) {
		let url;

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
		return(
			<Col xs={6}>
				<Button onClick={this.handleClick}>
					<Img src={this.getImageThumbnailUrl(this.props.img)}></Img>
				</Button>
			</Col>
		);
	}
};

export default ImageButton;