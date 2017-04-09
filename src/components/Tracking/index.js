import React from 'react';
import tracking from './lib/tracking.js';

const 

class Tracking extends React.Component {
	static defaultProps = {
		img: null
	}

	static state = {
		isTrackingLoaded: false,
		isProcessing: false
	}

	componentDidMount() {
		// this.props.img = document.getElementById('i');
	}

	render() {
		console.log(tracking);
		let tracker = new tracking.ObjectTracker(["face"]);

		// tracker.setStepSize(1.8);

		// tracking.track('#i', tracker);

		// tracker.on('track', (e) => {
		// 	e.data.forEach((r) => {
		// 		window.plot(r.x, r.y, r.width, r.height);
		// 	});
		// });

		// window.plot = (x, y, w, h) => {
		// 	const rect = document.createElement('div');
		// 	document.querySelector('#c').appendChild(rect);
		// 	rect.classList.add('rect');
  //       	rect.style.width = w + 'px';
  //       	rect.style.height = h + 'px';
  //       	rect.style.left = (img.offsetLeft + x) + 'px';
  //       	rect.style.top = (img.offsetTop + y) + 'px';
		// }


		return(
			<div></div>
		);
	}
}

export default Tracking;