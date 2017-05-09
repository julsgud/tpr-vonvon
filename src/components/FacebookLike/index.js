import React, {Component} from 'react';
import {string, oneOf, bool, oneOfType, number} from 'prop-types';

export default class FacebookLike extends Component {
	static propTypes = {
		language: string.isRequired,
		href: string,
		layout: oneOf(['standard', 'box_count', 'button_count', 'button']),
		action: string,
		size: string,
		share: bool, 
		showFaces: bool,
		width: oneOfType([string, number]),
		reference: string,
		colorscheme: string,
		kidDirectedSite: bool,
		sdkLoaded: bool
	};

	static defaultProps = {
		language: 'es_LA',
		layout: 'button_count',
		action: 'like',
		size: 'small',
		share: true,
		showFaces: false,
		colorscheme: 'light',
		kidDirectedSite: false,
	};

	render() {
		const {href, layout, action, size, share, showFaces, reference, width, colorscheme, kidDirectedSite} = this.props;
		if (!this.props.sdkLoaded) {
			console.log('fb-like-no-render');
			return(
				<div></div>
			);
		} else {
			console.log('fb-like-do-render');
			return (
				<div 
					className="fb-like"
					data-ref={reference}
					data-href={href}
					data-layout={layout}
					data-action={action}
					data-size={size}
					data-show-faces={showFaces}
					data-share={share}
					data-width={width}
					data-colorscheme={colorscheme}
					data-kid-directed-site={kidDirectedSite}
				/>
			);
		}
	}
}