import React, {Component} from 'react';
import styled from 'styled-components';
import {Grid, Row, Col} from 'react-flexbox-grid';
import palette from 'palette';

import Spotify from 'react-spotify-player';

const A = styled.a`
	color: ${palette.red};
	size: 10px;
	text-decoration: none;
`;

// Spotify Player Options
const size = {
  width: '100%',
  height: 100,
};

const view = 'coverart'; // or 'coverart'
const theme = 'black'; // or 'white'

export default class Footer extends Component {
	render() {
		return (
			<Row around='xs' center='xs' middle='xs'>
				
				<Col xs={12}>
					<Spotify
				  		uri="spotify:album:55Ul8L6tE3eO6JT8L11byT"
				  		size={size}
				  		view={view}
				  		theme={theme}
				  	/>
		  		</Col>
			</Row>
		);
	}
}