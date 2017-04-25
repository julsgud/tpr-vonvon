import React, {Component} from 'react';

import {Row, Col} from 'react-flexbox-grid';
import Loading from 'react-loading';
import axios from 'axios';
import styled from 'styled-components';
import update from 'immutability-helper';

import Share from 'components/Share';

import palette from 'palette';
import {pickCreature} from 'creatures';

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
			creature: null,
			canvas: {},
			frame: {}
		};
	}

	componentWillMount() {
		let c = this.findCanvasDimensions();

		let f = this.findFrameDimensions(c);

		let t = this.findImageType(this.props.image);

		let i = this.findImage(f, t);

		let cr = pickCreature(0);

		let newState = update(this.state, {
			canvas: {$set: c},
			frame: {$set: f},
			image: {$set: i},
			imageSource: {$set: i.source},
			imageType: {$set: t},
			creature: {$set: cr}
		});
		this.setState(newState, () => {
			// console.log(this.state);
		});
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

	pickCreature() {
		let o = {};

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
		const {canvas, frame, imageAnalysis, imageSource, imageType, creature, image} = this.state;

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

		// user, creature and object1 & 2 scale helpers
		let uh = {};
		let ch = {};
		let o1h = {};
		let o2h = {};

		/*
			Draw Images in order
		*/
		const img = new Image();
		const img2 = new Image();
		const img3 = new Image();
		const img4 = new Image();
		const img5 = new Image();

		// user frame
		const loadImage1 = () => {
			img.onload = () =>  {
			loadImage2();
				uh = getUserHelpers(imageType, img.naturalWidth, img.naturalHeight, frame1, frameWidth, frameHeight, imageAnalysis);
		    	ctx.drawImage(img, uh.x, uh.y, uh.w, uh.h, uh.frameX, uh.frameY, uh.frameWidth, uh.frameHeight);
		    	ctx.fillStyle='#f31c21';
		    	ctx.fillRect(uh.leftEyeX, uh.leftEyeY, 20, 20);
		    	ctx.fillRect(uh.rightEyeX, uh.rightEyeY, 20, 20);
			};
			img.src = imageSource;
		}

		// user frame for mods
		const loadImage2 = () => {
			img2.onload = function() {
				loadImage3();
		    	ctx.drawImage(img2, uh.x, uh.y, uh.w, uh.h, frame2.x, frame2.y, frameWidth, frameHeight);
			};
			img2.src = imageSource;
		};

		// object 1
		const loadImage3 = () => {
			const img3 = new Image();
			img3.onload = () => {
				loadImage4();
				o1h = getObjectHelpers(creature.name, img3.naturalWidth, img3.naturalHeight, frame2.x, frame2.y, frameWidth, frameHeight, imageAnalysis);
				ctx.drawImage(img3, o1h.x, o1h.y, o1h.w, o1h.h, o1h.frameX, o1h.frameY, o1h.frameWidth, o1h.frameHeight);
			}
			img3.src = 'https://res.cloudinary.com/julsgc/image/upload/c_scale,q_100,w_' + frameHeight.toFixed(0).toString() + '/v1491770566/' + creature.object1 + '.png';
		}

		// object 2
		const loadImage4 = () => {
			img4.onload = () => {
				loadImage5();
				//ctx.drawImage(img4, frame3.x, frame3.y, frameWidth, frameHeight);
			}
			img4.src = 'https://res.cloudinary.com/julsgc/image/upload/c_scale,q_100,w_' + frameWidth.toFixed(0).toString() + '/v1491770566/Rey_gqihcs.png';
		}

		// creature
		const loadImage5 = () => {
			img5.onload = () => {
				ch = getCreatureHelpers(creature.name, img5.naturalWidth, img5.naturalHeight, frame3.x, frame3.y, frameWidth, frameHeight);
				ctx.drawImage(img5, ch.x, ch.y, ch.w, ch.h, ch.frameX, ch.frameY, ch.frameWidth, ch.frameHeight);
			}
			img5.src = 'https://res.cloudinary.com/julsgc/image/upload/c_scale,q_100,w_' + frameHeight.toFixed(0).toString() + '/v1491770566/' + creature.name + '.png';
		}

		const getUserHelpers = (type, srcWidth, srcHeight, frame, frameWidth, frameHeight, imageAnalysis) => {
			let s = {};
			const boxX = imageAnalysis.topLeftX;
			const boxWidth = imageAnalysis.width;
			const boxY = imageAnalysis.topLeftY;
			const boxHeight = imageAnalysis.height;

			if (type == 'landscape' || type == 'square') {
				// Width of image when resized to fit new height
				let newWidth = frameHeight * srcWidth / srcHeight;

				// chunk in resized image that will be cropped
				s.w = frameWidth * srcWidth / newWidth;
				s.h = srcHeight;

				// where to start cut
				const newBoxX = boxX * newWidth / srcWidth;
				s.x = boxX - (Math.abs(boxWidth - s.w))/2;
				s.y = 0;

				console.warn(newBoxX + ' ' + boxX);

				// frame dims
				s.frameX = frame.x;
				s.frameY = frame.y;
				s.frameWidth = frameWidth;
				s.frameHeight = frameHeight;

				// eye pos with resize
				const leftEyeXPost = imageAnalysis.leftEyeCenterX * newWidth / srcWidth;
				const leftEyeYPost = imageAnalysis.leftEyeCenterY * frameHeight / srcHeight;
				const rightEyeXPost = imageAnalysis.rightEyeCenterX * newWidth / srcWidth;
				const rightEyeYPost = imageAnalysis.rightEyeCenterY * frameHeight / srcHeight;

				// eye pos in frame
				s.leftEyeX = Math.abs(leftEyeXPost - s.x + s.frameX);
				s.leftEyeY = Math.abs(leftEyeYPost - s.y + s.frameY);
				s.rightEyeX = Math.abs(rightEyeXPost - s.x + xMargin);
				s.rightEyeY = Math.abs(rightEyeYPost - s.y + yMargin);

				console.log(srcWidth + ' ' + newWidth + ' ' + srcHeight + ' ' + frameHeight);
				console.log(imageAnalysis.leftEyeCenterX + ' ' + s.leftEyeX);
				console.log(imageAnalysis.leftEyeCenterY + ' ' + s.leftEyeY);

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

		const getCreatureHelpers = (name, srcWidth, srcHeight, frameX, frameY, frameWidth, frameHeight) => {
			let s = {};

			switch(name) {
				case 'joto':

				// console.log(imageAnalysis);
					s.x = (srcWidth-frameWidth)/2.7;
					s.w = frameWidth*1.22;
					s.h = frameHeight*1.22;
					s.y = -(frameHeight - s.w)/3;

					s.frameX = frameX;
					s.frameY = frameY;
					s.frameWidth = frameWidth;
					s.frameHeight = frameHeight;

				break;
			}

			return s;
		};

		const getObjectHelpers = (name, srcWidth, srcHeight, frameX, frameY, frameWidth, frameHeight, imageAnalysis) => {
			let s = {};

			switch(name) {
				case 'joto':

					s.x = 0;
					s.y = 0;
					s.w = frameWidth;
					s.h = frameHeight;
					s.frameX = frameX;
					s.frameY = frameY;
					s.frameWidth = frameWidth;
					s.frameHeight = frameHeight;

				break;
			}

			return s;
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