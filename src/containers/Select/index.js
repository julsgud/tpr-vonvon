import React, {Component} from 'react';

import {Row, Col} from 'react-flexbox-grid';

import styled from 'styled-components';
import palette from 'palette';

const Img = styled.img`
	max-width: 100%;
	width: 100px;
`;

const H3 = styled.h3`
	color: ${palette.black};
`;

export default class Select extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<Row center='xs'>
				<Col xs={12}>
					<H3> Select Pic </H3>
				</Col>
				<Col xs={12}>
					<Img src={this.props.user.picture.data.url}></Img>
				</Col>
			</Row>
		);
	}
}