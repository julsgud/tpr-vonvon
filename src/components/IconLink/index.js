import React, {Component} from 'react';
import styled from 'styled-components';

import palette from 'palette';

const A = styled.a`
	color: ${palette.red};

	&:hover {
		color: ${palette.blue};
	}
`;

class IconLink extends Component {
	render() {
		return(
			<A href={this.props.url}><i className={'fa ' + this.props.class}></i></A>
		)
	}
}

IconLink.propTypes = {
	url: React.PropTypes.string.isRequired,
	class: React.PropTypes.string.isRequired

}

export default IconLink;

