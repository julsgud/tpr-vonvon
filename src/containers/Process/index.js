import React, {Component} from 'react';

import {Row, Col} from 'react-flexbox-grid';

import styled from 'styled-components';
import palette from 'palette';

const Img = styled.img`
	max-width: 100%;
	width: 200px;
`;

const H3 = styled.h3`
	color: ${palette.black};
`;

class Process extends Component {
	render() {
		return(
			<Row center='xs'>
				<Col xs={12}>
					<H3> Process </H3>
				</Col>
				<Col xs={12}>
					
				</Col>
			</Row>
		);
	}
}

Process.propTypes = {
	history: React.PropTypes.object
}

export default Process;