import React, {Component} from 'react';
import styled from 'styled-components';
import {Row, Col} from 'react-flexbox-grid';

import FacebookLike from 'components/FacebookLike';

const H3 = styled.h3`
	size: 32px;

	&:hover {
		color: #ff7e81;
		cursor: crosshair;
	}
`;

const Img = styled.img`
	max-width: 100%;
	min-height: 100%;
`;

export default class Header extends Component {
	render() {
		return (
			<div>
				<Row bottom='xs' middle='xs' center='xs'>
					<Col xs={12}>
						<Img src="https://res.cloudinary.com/julsgc/image/upload/v1494274636/banner_title.png"></Img>
					</Col>
					<Col xs={6}>
						<FacebookLike sdkLoaded={this.props.sdkLoaded} href="https://www.facebook.com/theplasticsrevolutionmx"/>
					</Col>
				</Row>
			</div>
		);
	}
}

