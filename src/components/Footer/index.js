import React, {Component} from 'react';
import styled from 'styled-components';
import {Grid, Row, Col} from 'react-flexbox-grid';

const A = styled.a`
	color: #f43449;

	&:hover {
		color: #ff7e81;
	}
`;

export default class Footer extends Component {
	render() {
		return (
				<Row center='xs' around='xs'>
					<Col xs={3}>
						<A href="https://www.facebook.com/theplasticsrevolutionmx/"><i className="fa fa-facebook"></i></A>
					</Col>
					<Col xs={3}>
						<A href="https://twitter.com/plasticsrev/"><i className="fa fa-twitter"></i></A>
					</Col>
					<Col xs={3}>
						<A href="https://www.instagram.com/plasticsrevolution/"><i className="fa fa-instagram"></i></A>
					</Col>
				</Row>
		)
	}
}