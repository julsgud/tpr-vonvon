import React, {Component} from 'react';
import {string} from 'prop-types';
import styled from 'styled-components';
import {Row, Col} from 'react-flexbox-grid';
import palette from 'palette';

import Spotify from 'react-spotify-player';

const A = styled.a`
	color: ${palette.red};
	size: 4px;
	text-decoration: none;
`;

// Spotify Player Options
const size = {
  width: '100%',
  height: 100,
};
const view = 'coverart'; // or 'coverart'
const theme = 'black'; // or 'white'

// Component displaying spotify player
// and privacy policy link
class Footer extends Component {
	render() {
		return (
			<Row around='xs' center='xs' middle='xs'>
				<Col xs={12}>
					<Spotify
				  		uri={this.props.playThis}
				  		size={size}
				  		view={view}
				  		theme={theme}
				  	/>
		  		</Col>
		  		<Col> <A href="https://termsfeed.com/privacy-policy/54cb5723bfac5aaec975d816662b8a37"> ◕ ◡ ◕ </A> </Col>
			</Row>
		);
	}
}

Footer.propTypes = {
	playThis: string
}

export default Footer;