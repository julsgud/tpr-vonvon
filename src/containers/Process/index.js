import React, {Component} from 'react';

import {Row, Col} from 'react-flexbox-grid';

import styled from 'styled-components';
import palette from 'palette';

import Clarifai from 'clarifai';
import clm from 'clmtrackr/clmtrackr.js';
import pModel from 'clmtrackr/models/model_pca_20_svm.js';


const Img = styled.img`
`;

const H3 = styled.h3`
	color: ${palette.black};
`;

const Canvas = styled.canvas`
`;

const CLIENT_ID = 'N6O0CX9Q-Wz6rczYvCnh5gfDa5D3ZVS87XMwvJrD';
const CLIENT_SECRET = 'y-YRhdoGbXGpqPMOcUDaYNR1mSc-dMGQ06Cu-BLw';

const cApp = new Clarifai.App(CLIENT_ID, CLIENT_SECRET);
let imageSize = 200;


class Process extends Component {
	constructor() {
		super();
		this.state = {
			margin: null
		};
	}

	componentWillMount() {
		const imgUrl = "https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/14141904_10157493651325571_2937761036611221966_n.jpg?oh=3aa2092405c0b8ce9eefe3af8760095f&oe=59979D18";
		// return cApp.models.predict("a403429f2ddf4b49b307e318f00e528b", imgUrl)
		// 	.then((response) => {
		// 		let x1, x2, y1, y2;
		// 		let mT, mR, mB, mL;

		// 		const box = response.outputs[0].data.regions[0].region_info.bounding_box;

		// 		x1 = Number(box.top_row) * imageSize;
		// 		mT = x1 - imageSize;
		// 		y1 = Number(box.left_col) * imageSize;
		// 		mL = y1 - imageSize;
		// 		x2 = Number(box.bottom_row) * imageSize;
		// 		mB = imageSize - x2;
		// 		y2 = Number(box.right_col) * imageSize;
		// 		mR = imageSize - y2;

		// 		this.setState({margin: {
		// 			top: mT.toString() + 'px',
		// 			right: mR.toString() + 'px',
		// 			bottom: mB.toString() + 'px',
		// 			left: mL.toString() + 'px'
		// 		}});
		// 	});
	}

	componentDidMount() {
		/*
			1.Get canvas element and context
			Initialize trackr
			Get image element
		*/
		const c = document.getElementById('c');
		const ctx = c.getContext('2d');

		const tracker = new clm.tracker();
		tracker.init(pModel);

		const i = document.getElementById('i');

		/* 
			2. Determine canvas width and height
			Max: 800px as determined in appWrapper css
			Margin of 5px
			Use aspect ratio of 16:9
		*/
		if (window.innerWidth < 800) {
			c.width = window.innerWidth - 16;
			c.height = (c.width*9)/16;
		} else {
			c.width = 800;
			c.height = (c.width*9)/16;
		}

		const w = c.width;
		const h = c.height;

		/*
			3. Determine margins and frame dims
		*/
		const xMargin = w/35;
		const yMargin = h/13;
		const frameWidth = (w - (xMargin * 4))/3;
		const frameHeight = h - (yMargin * 2);

		const frame1 = {
			'x': xMargin,
			'y': yMargin
		}

		const frame2 = {
			'x': (xMargin * 2) + frameWidth,
			'y': yMargin
		}

		const frame3 = {
			'x': (xMargin * 3) + (frameWidth * 2),
			'y': yMargin
		}

		/*
			4. Load, prep and draw images
		*/
		// Leftmost
		const img = document.createElement('img');
		img.onload = function() {
		    ctx.drawImage(img, frame1.x, frame1.y, frameWidth, frameHeight);
		};
		img.crossOrigin='Anonymous';
		img.src = 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/14141904_10157493651325571_2937761036611221966_n.jpg?oh=3aa2092405c0b8ce9eefe3af8760095f&oe=59979D18';

		const img2 = new Image();
		img2.onload = function() {
		    ctx.drawImage(img2, frame2.x, frame2.y, frameWidth, frameHeight);
		};
		img2.src = 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/14141904_10157493651325571_2937761036611221966_n.jpg?oh=3aa2092405c0b8ce9eefe3af8760095f&oe=59979D18';

		const img3 = new Image();
		img3.onload = () => {
			console.log(img3.naturalWidth, img3.naturalHeight);
			ctx.drawImage(img3, frame3.x, frame3.y, frameWidth, frameHeight);
		}
		img3.src = 'http://res.cloudinary.com/julsgc/image/upload/c_scale,q_100,w_' + frameWidth.toFixed(0).toString() + '/v1491770566/Rey_gqihcs.png';
	}

	render() {
		const imgUrl = 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/14141904_10157493651325571_2937761036611221966_n.jpg?oh=3aa2092405c0b8ce9eefe3af8760095f&oe=59979D18';
	
		if (this.state.margin) {
			console.log('hey');
			return (<div> Processing! </div>);
		} else {

			return(
				<Row center='xs'>
					<Col xs={12}>
						<H3> Here we go </H3>
						<br></br>
					</Col>
					<Col xs={12}>
						<Canvas id="c"></Canvas>
					</Col>
				</Row>
			);
		}
	}
}

Process.propTypes = {
	history: React.PropTypes.object
}

export default Process;