import React, {Component} from 'react';

import FacebookLogin from 'components/FacebookLogin';
import {Row, Col} from 'react-flexbox-grid';

import styled from 'styled-components';
import palette from 'palette';

const Img = styled.img`
	max-width: 100%;
`;

const H3 = styled.h3`
	color: ${palette.black};
`;

class Privacy extends Component {
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
			</Row>
		);
	}
}

Privacy.propTypes = {
	history: React.PropTypes.object
}

export default Privacy;