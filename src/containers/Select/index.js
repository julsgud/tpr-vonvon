import React, {Component} from 'react';

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
	getFirstName(name) {
		let str = name;
		let s;

		s = str.substr(0, str.indexOf(' '));

		return s;
	}

	render() {
		return(
			<Row center='xs'>
				<Col xs={12}>
					<H3> Hey {this.getFirstName(this.props.info.name)}, escoge una foto! </H3>
				</Col>
				<Col xs={12}>
					<button onClick={() => {
						this.props.selectionHandler(this.props.image.data.url);
						this.props.history.push('/process');
					}}>
						<Img src={this.props.image.data.url}></Img>
					</button>
				</Col>
			</Row>
		);
	}
}

Select.propTypes = {
	history: React.PropTypes.object
}

export default Select;