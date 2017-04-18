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
			<Col xs>
				<button onClick={this.handleClick}>
					<img src={this.props.src}></img>
				</button>
			</Col>
		);
	}
};

export default ImageButton;