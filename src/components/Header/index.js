import React, {Component} from 'react';
import styled from 'styled-components';

import Spotify from 'react-spotify-player';
import {Row, Col} from 'react-flexbox-grid';

const H3 = styled.h3`
	color: #f43449;
	size: 32px;

	&:hover {
		color: #ff7e81;
		cursor: crosshair;
	}
`;

// Spotify Player Options
const size = {
  width: '100%',
  height: 100,
};

const view = 'coverart'; // or 'coverart'
const theme = 'white'; // or 'white'


export default class Header extends Component {
	render() {
		return (
			<Row around='xs' middle='xs'>
				<Col xs={6}>
					<H3> The Plastics Revolution </H3>
				</Col>

				<Col xs={5}>
					<Spotify
				  		uri="spotify:album:55Ul8L6tE3eO6JT8L11byT"
				  		size={size}
				  		view={view}
				  	theme={theme}/>
			  	</Col>

			 </Row>
		)
	}
}

