import React, {Component} from 'react';

import FacebookLogin from 'components/FacebookLogin';
import {Row, Col} from 'react-flexbox-grid';

import styled from 'styled-components';
import palette from 'palette';

const Img = styled.img`
	max-width: 100%;
`;

const buttonStyle = {
	marginBottom: '20px'
}

class Home extends Component {
	componentDidMount() {
		console.log('** 2 **: Mounted Home Component');
	}

	render() {
		return(
			<Row center='xs' around='xs' middle='xs'>
				<Col xs={12}>
					<h3> A cuál de los #SeresExtraordinarios te pareces!? </h3>
				</Col>
				<Col style={buttonStyle}>
					<FacebookLogin 
						infoCallback={this.props.infoHandler}
						imageCallback={(data) => {
							this.props.imageHandler(data);
							this.props.history.push('/select');
						}}/>
				</Col>
			</Row>
		);
	}
}

Home.propTypes = {
	history: React.PropTypes.object
}


export default Home;