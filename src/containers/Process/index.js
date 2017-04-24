import React, {Component} from 'react';

import {Row, Col} from 'react-flexbox-grid';
import Loading from 'react-loading';
import axios from 'axios';
import styled from 'styled-components';
import update from 'immutability-helper';

import Share from 'components/Share';

import palette from 'palette';

const Img = styled.img`
`;

const H3 = styled.h3`
	color: ${palette.black};
`;

const Canvas = styled.canvas`
`;

const KAIROS_ID = '69e02886';
const KAIROS_KEY = '6423bdb83597bcfe304c3752576a190d';

class Process extends Component {
	constructor(props) {
		super(props);

		this.state = {
			image: null,
			imageSource: null,
			imageAnalysis: null,
			imageType: null,
			loading: true,
			canvas: {},
			frame: {}
		};
	}

	componentWillMount() {
		let c = this.findCanvasDimensions();

		let f = this.findFrameDimensions(c);

		let t = this.findImageType(this.props.image);

		let i = this.findImage(f, t);

		let newState = update(this.state, {
			canvas: {$set: c},
			frame: {$set: f},
			image: {$set: i},
			imageSource: {$set: i.source},
			imageType: {$set: t}
		});
		this.setState(newState, () => {
			console.log(this.state);
		});
		console.log(this.props.image);
	}

	findCanvasDimensions() {
		let c = {};

		if (window.innerWidth < 800) {
			c.width = window.innerWidth - 16;
			c.height = (c.width*9)/16;
		} else {
			c.width = 800;
			c.height = (c.width*9)/16;
		}

		// console.log(c);

		return c;
	}

	findFrameDimensions(c) {
		let f = {};

		f.xMargin = c.width/35;
		f.yMargin = c.height/13;
		f.width = (c.width - (f.xMargin * 4))/3;
		f.height = c.height - (f.yMargin * 2);

		return f;
	}

	findImage(f, type) {
		let i = {};

		if (type == 'landscape' || type == 'square') {
			i = this.sizeRundownBy('height', f);
		} else {
			i = this.sizeRundownBy('width', f);
		}		

		return i;
	}

	sizeRundownBy(dimensionToCompare, frame) {
		let i = {};

		i = this.findNearestSizeVersion(dimensionToCompare, frame, 50);
		if (i.bool) {
			return this.props.image.images[i.index];
		} else {
			i = this.findNearestSizeVersion(dimensionToCompare, frame, 100);
			if (i.bool) {
				return this.props.image.images[i.index];
			} else {
				i = this.findNearestSizeVersion(dimensionToCompare, frame, 200);
				if (i.bool) {
					return this.props.image.images[i.index];
				} else {
					i = this.findNearestSizeVersion(dimensionToCompare, frame, 300);
					if (i.bool) {
						return this.props.image.images[i.index];
					} else {
						console.error('no image, pick another one');
					}
				}
			}
		}
	}

	findNearestSizeVersion(dimensionToCompare, frame, difference) {
		let o = {};
		o.bool = false;
		let frameDimension = frame[dimensionToCompare]; 
		
		for (let i = 0; i < this.props.image.images.length; i++) {
			if (this.props.image.images[i][dimensionToCompare] < frameDimension + difference && this.props.image.images[i][dimensionToCompare] > frameDimension - difference) {
				o.index = i;
				o.bool = true;
				console.log('** image: ' + this.props.image.images[i][dimensionToCompare] + ' ** frame: ' + frameDimension);
				break;
			} 
		}

		return o;
	}

	findImageType(image) {
		let str = '';

		if (image.images[0].width == image.images[0].height) {
			str = 'square';
		} else if (image.images[0].width > image.images[0].height) {
			str = 'landscape';
		} else {
			str = 'portait';
		}

		return str;
	}

	componentDidMount() {
		return axios({
			method: 'post',
			url: 'https://api.kairos.com/detect',
			headers: {
				'Content-Type': 'application/json',
				app_id: KAIROS_ID,
				app_key: KAIROS_KEY
			},
			data: {
				'image': this.state.imageSource
			}
		}).then((response) => {			
			if (this.analysisFailed(response)) {
				if (this.errorOnFacialRecognition(response)) {
					this.props.errorHandler('No encontramos tu cara, escoge otra foto!');
					return this.props.history.push('/select');
				} else if (this.foundMultipleFaces(response)) {
					this.props.errorHandler('Trampa! Hay mas de una cara en esa foto, escoge otra!');
					return this.props.history.push('/select');
				}
			}
			let newState = update(this.state, {
				imageAnalysis: {$set: response.data.images[0].faces[0]}
			});
			this.setState(newState, () => {
				//console.log(this.state);
				// console.log(response.data.images[0].faces[0]);
			});
			return this.onKairosResponse();
		}).catch((error) => {
			console.error(error);
		});
	}

	errorOnFacialRecognition(response) {
		let bool = false;

		if (response.data.Errors[0].ErrCode == 5002) {
			bool = true;
		}
		return bool;
	}

	foundMultipleFaces(response) {
		let bool = false;

		if (response.data.images[0].faces.length > 1) {
			bool = true;
		}

		return bool;
	}

	analysisFailed(response) {
		let bool = false;

		if (response.data.hasOwnProperty('Errors')) {
			bool = true;
		}

		return bool;
	}

	onKairosResponse() {
		return this.setState({loading: false});
	}

	componentDidUpdate() {
		if (!this.state.loading) {
			this.drawCanvas();
		}
	}

	drawCanvas() {
		const {canvas, frame, imageAnalysis, imageSource, imageType} = this.state;

		const c = document.getElementById('c');
		c.width = canvas.width;
		c.height = canvas.height;
		const ctx = c.getContext('2d');

		// get width and height from state
		const w = c.width;
		const h = c.height;
		console.log('** window: w' + window.innerWidth +'px h' + window.innerHeight + 'px ** canvas: ' + c.width + 'px h' + c.height+ 'px');

		// get margins and frame w and h from state
		const frameWidth = frame.width;
		const frameHeight = frame.height;
		const xMargin = frame.xMargin;
		const yMargin = frame.yMargin;

		console.log('** frameWidth: ' + frameWidth + ' ** frameHeight: ' + frameHeight);

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

		let s = {};

		/*
			Draw Images in order
		*/

		// Resize image proportionally to fit face box best inside frame
		const img = new Image();
		const img2 = new Image();
		const img3 = new Image();
		const img4 = new Image();

		const loadImage2 = () => {
			img2.onload = function() {
				loadImage3();
		    	ctx.drawImage(img2, s.x, s.y, s.w, s.h, frame2.x, frame2.y, frameWidth, frameHeight);
			};
			img2.src = imageSource;
		};
		
		const loadImage3 = () => {
			const img3 = new Image();
			img3.onload = () => {
				loadImage4();
				ctx.globalAlpha = 0.5;
				ctx.drawImage(img3, frame2.x, frame2.y, frameWidth, frameHeight);
			}
			img3.src = 'https://res.cloudinary.com/julsgc/image/upload/c_scale,q_100,w_' + frameWidth.toFixed(0).toString() + '/v1491770566/Rey_gqihcs.png';
		}

		const loadImage4 = () => {
			img4.onload = () => {
				ctx.globalAlpha = 1;
				ctx.drawImage(img4, frame3.x, frame3.y, frameWidth, frameHeight);
			}
			img4.src = 'https://res.cloudinary.com/julsgc/image/upload/c_scale,q_100,w_' + frameWidth.toFixed(0).toString() + '/v1491770566/Rey_gqihcs.png';
		}

		const loadImage1 = () => {
			img.onload = () =>  {
			loadImage2();
				s = getScaleHelpers(imageType, img.naturalWidth, img.naturalHeight, frameWidth, frameHeight, imageAnalysis.topLeftX, imageAnalysis.topLeftY, imageAnalysis.width, imageAnalysis.height);
		    	ctx.drawImage(img, s.x, s.y, s.w, s.h, frame1.x, frame1.y, frameWidth, frameHeight);
			};
			img.src = imageSource;
		}

		const getScaleHelpers = (type, srcWidth, srcHeight, frameWidth, frameHeight, boxX, boxY, boxWidth, boxHeight) => {
			let s = {};

			if (type == 'landscape' || type == 'square') {
				// new width
				let newWidth = frameHeight * srcWidth / srcHeight;

				// width of chunk to resize
				s.w = frameWidth * srcWidth / newWidth;
				s.h = srcHeight;

				// where to start cut
				s.x = boxX - (Math.abs(boxWidth - s.w))/2;
				s.y = 0;

				return s;
			} else {
				// new
				let newHeight = frameWidth * srcHeight / srcWidth;

				// width of chunk
				s.w = srcWidth;
				s.h = frameHeight * srcHeight / newHeight;

				// where to start cut
				s.x = 0;
				s.y = boxY - (Math.abs(boxHeight - s.h))/2;

				return s;
			}
		}
		loadImage1();	
	}

	canvasToBlob() {
		const c = document.getElementById('c');

		c.toBlob((blob) => {
			let newImg = document.createElement('img');
		});
	}

	getFirstName(name) {
		let str = name;
		let s;

		s = str.substr(0, str.indexOf(' '));

		return s;
	}

	render() {
		if (this.state.loading) {
			return (
				<Row center='xs'>
					<Col>
						<Loading type='bubbles' color={palette.red}/>
					</Col>
				</Row>
			);
		} else {

			return(
				<Row center='xs'>
					<Col xs={12}>
						<H3> {this.getFirstName(this.props.user.name)}, te pareces al Rey Extraordinario! </H3>
						<br></br>
					</Col>
					<Col xs={12}>
						<Canvas id="c"></Canvas>
					</Col>
					<Col xs={8}>
						<Share id="c"></Share>
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