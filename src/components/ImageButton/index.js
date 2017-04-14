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

	render() {
		return(
			<Col>
				<button onClick={this.handleClick}>
					<img src={this.props.img}></img>
				</button>
			</Col>
		);
	}
};

export default ImageButton;