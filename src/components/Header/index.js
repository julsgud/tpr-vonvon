import React, {Component} from 'react';
import styled from 'styled-components';
import {Row, Col} from 'react-flexbox-grid';

import FacebookProvider, {Like} from 'react-facebook';

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
						<Img src="http://res.cloudinary.com/julsgc/image/upload/v1494274636/banner_title.png"></Img>
					</Col>
					<Col xsOffset={3} xs={6}>
						{/*<FacebookProvider appId='1418273384901709'>
							<Like href="https://www.facebook.com/theplasticsrevolutionmx" colorScheme="dark"/>
						</FacebookProvider>*/}
					</Col>
				</Row>
			</div>
		);
	}
}

