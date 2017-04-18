import React from 'react';
import {Col} from 'react-flexbox-grid';



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
			<Col xs>
				<button onClick={this.handleClick}>
					<img src={this.getImageThumbnailUrl(this.props.img)}></img>
				</button>
			</Col>
		);
	}
};

export default ImageButton;