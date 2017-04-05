import React, {Component} from 'react';

import FacebookLogin from 'react-facebook-login';
import {Row, Col} from 'react-flexbox-grid';

import styled from 'styled-components';
import palette from 'palette';

const Img = styled.img`
	max-width: 100%;
`;

const H3 = styled.h3`
	color: ${palette.black};
`;

const responseFb = (data) => {
	console.log(data);
}

export default class Home extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<Row center='xs'>
				<Col xs={12}>
					<Img src="https://res.cloudinary.com/julsgc/image/upload/v1491106020/Boletia_995x380__2_fqawa8.png"/>
				</Col>
				<Col xs={12}>
					<h3> A que Ser Extraordinario te pareces!? </h3>
				</Col>
				<Col xs={12}>
					<p> Averigualo ahora! </p>
				</Col>
				<Col>
					<FacebookLogin 
						appId="1418273384901709"
						autoLoad={false}
						fields="name, email, picture"
						scope="public_profile"
						callback={this.props.handler}
						textButton="Continua con Facebook"/>
				</Col>
			</Row>
		);
	}
}