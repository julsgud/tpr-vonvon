import React, {Component} from 'react';

import ImageButton from 'components/ImageButton';

import {Row, Col} from 'react-flexbox-grid';

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
	}

	componentWillMount() {

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

Select.propTypes = {
	history: React.PropTypes.object
}

export default Select;