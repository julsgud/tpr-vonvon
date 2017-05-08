import React, {Component} from 'react';

import FacebookLogin from 'components/FacebookLogin';
import {Row, Col} from 'react-flexbox-grid';

import styled from 'styled-components';
import palette from 'palette';

const Img = styled.img`
	max-width: 100%;
`;

class Home extends Component {
	componentDidMount() {
		console.log('** 2 **: Mounted Home Component');
	}

	render() {
		return(
			<Row center='xs' around='xs' middle='xs'>
				<Col xs={12}>
					{/*<Img src="https://res.cloudinary.com/julsgc/image/upload/v1491106020/Boletia_995x380__2_fqawa8.png"/>*/}
				</Col>
				<Col xs={12}>
					<h3> A cuál de los #SeresExtraordinarios te pareces!? </h3>
					<div className="fb-like" data-href="https://www.facebook.com/theplasticsrevolutionmx/" data-layout="button_count" data-action="like" data-size="small" data-show-faces="false" data-share="false" data-width={200}></div>
				</Col>
				<Col>
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