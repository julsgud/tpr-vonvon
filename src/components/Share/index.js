import React, {Component} from 'react';

import styled from 'styled-components';

const Button = styled.button`
	background: #2d41a3;
	color: #fff;
	font-size: 18px;
	width: 100%;
	margin: 10px 20px 10px 0px;
	border: 0px;
	text-align: center;
	line-height: 50px;
	white-space: nowrap;
	/*border-radius: 5px;*/
`;

class Share extends Component {
	render() {
		return (
			<Button> Compartir en FB </Button>
		);
	};
}

export default Share;