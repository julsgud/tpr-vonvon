import React, {Component} from 'react';

class IconLink extends Component {
	render() {
		return(
			<A href={this.props.url}><i className={'fa ' + this.props.class}></i></A>
		)
	}
}

IconLink.propTypes = {
	url: PropTypes.string.isRequired,
	class: PropTypes.string.isRequired

}

export default IconLink;

