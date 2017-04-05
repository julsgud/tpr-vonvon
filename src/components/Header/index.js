import React, {Component} from 'react';
import styled from 'styled-components';
import {Row, Col} from 'react-flexbox-grid';
import IconLink from 'components/IconLink';

const H3 = styled.h3`
	color: #f43449;
	size: 32px;

	&:hover {
		color: #ff7e81;
		cursor: crosshair;
	}
`;

const StyledIconLink = styled(IconLink)`
	color: #f43449;

	&:hover {
		color: #ff7e81;
	}
`;

export default class Header extends Component {
	render() {
		return (
			<Row around='xs' middle='xs'>
				<Col xs={6}>
					<H3> The Plastics Revolution </H3>
				</Col>
				<Col xs={1}>
					<StyledIconLink url="https://www.facebook.com/theplasticsrevolutionmx/" class="fa-facebook"/>
				</Col>
				<Col xs={1}>
					<StyledIconLink url="https://twitter.com/plasticsrev/" class="fa-twitter"/>
				</Col>
				<Col xs={1}>
					<StyledIconLink url="https://www.instagram.com/plasticsrevolution/" class="fa-instagram"/>
				</Col>

			 </Row>
		)
	}
}

