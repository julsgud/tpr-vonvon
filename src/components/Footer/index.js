import React, {Component} from 'react';
import styled from 'styled-components';
import {Grid, Row, Col} from 'react-flexbox-grid';

import Spotify from 'react-spotify-player';

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
				<Row center='xs' around='xs'>
					<Col>
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