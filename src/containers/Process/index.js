import React, {Component} from 'react';

import {Row, Col} from 'react-flexbox-grid';
import Loading from 'react-loading';
import axios from 'axios';
import styled from 'styled-components';
import update from 'immutability-helper';

import Share from 'components/Share';

import palette from 'palette';
import {getSecondAnalysis} from 'requests';
import {pickCreature, getCreatureUrl, getObjectUrl, getCreatureHelpers} from 'creatures';
import {findCanvasDimensions, findFrameDimensions, getFrame1Helpers, getFrame2Helpers, getRandomBetween} from 'helpers';

const Img = styled.img`
`;

const H3 = styled.h3`
	color: ${palette.black};
`;

const HiddenCanvas = styled.canvas`
	display: none;
`;

const KAIROS_ID = '69e02886';
const KAIROS_KEY = '6423bdb83597bcfe304c3752576a190d';

class Process extends Component {
	constructor(props) {
		super(props);

		this.state = {
			image: null,
			imageBlob: null,
			imageSource: null,
			imageAnalysis: null,
			imageAnalysis2: null,
			imageType: null,
			loading: true,
			processing: true,
			firstAnalysis: false,
			secondAnalysis: false,
			creature: null,
			gender: null,
			likes: null,
			canvas: {},
			frame: {}
		};

		this.handleSecondAnalysis = this.handleSecondAnalysis.bind(this);
	}

	componentWillMount() {
		const c = findCanvasDimensions();

		const f = findFrameDimensions(c);

		const t = this.findImageType(this.props.image);

		const i = this.findLargestImage();

		// const cr = pickCreature(getRandomBetween(0, 4));
		const cr = pickCreature(0);

		const g = this.props.user.gender;

		if (this.props.user.meeting_for) {
			const l = this.props.user.meeting_for;
		} else {
			if (this.props.user.gender == 'male') {
				const l = 'female';
			} else {
				const l = 'male';
			}
		}

		let newState = update(this.state, {
			canvas: {$set: c},
			frame: {$set: f},
			image: {$set: i},
			imageSource: {$set: i.source},
			imageType: {$set: t},
			creature: {$set: cr},
			gender: {$set: g},
			likes: {$set: l}
		});
		this.setState(newState, () => {
			// console.log(this.state);
		});
	}

	findLargestImage() {
		const array = this.props.image.images;
		let largest = Number.NEGATIVE_INFINITY;
		let smallest = Number.POSITIVE_INFINITY;
		let tmp, index;

		for (let i = 0; i < array.length; i++) {
			tmp = array[i].width;
			if (tmp < smallest) smallest = tmp;
			if (tmp > largest) {
				largest = tmp;
				index = i;
			}
		}

		return array[index];
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
		console.log(this.props.user);

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
		return this.setState({firstAnalysis: true});
	}

	componentDidUpdate() {
		if (this.state.loading && this.state.firstAnalysis && this.state.processing) {
			this.drawCanvasForSecondAnalysis();
		} else if (this.state.loading && this.state.secondAnalysis) {
			this.drawCanvasWithObjects();
		}
	}

	handleSecondAnalysis(response) {
		const data = response;
		const newState = update(this.state, {
			imageAnalysis2: {$set: data},
			secondAnalysis: {$set: true}
		});
		this.setState(newState, () => {
			// console.log(this.state);
		});
	}

	drawCanvasForSecondAnalysis() {
		const {canvas, frame, imageAnalysis, imageSource, imageType, creature, image} = this.state;

		const c = document.getElementById('c');
		c.width = 800;
		c.height = 450;
		const ctx = c.getContext('2d');

		// get width and height from state
		const w = c.width;
		const h = c.height;
		// console.log('** window: w' + window.innerWidth +'px h' + window.innerHeight + 'px ** canvas: ' + c.width + 'px h' + c.height+ 'px');

		// get margins and frame w and h from state
		const frameWidth = frame.width;
		const frameHeight = frame.height;
		const xMargin = frame.xMargin;
		const yMargin = frame.yMargin;

		// console.log('** frameWidth: ' + frameWidth + ' ** frameHeight: ' + frameHeight);

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
		let uh2 = {};
		let ch = {};
		let o1h = {};
		let o2h = {};

		/*
			Draw Images in order
		*/
		const img = new Image();
		const img2 = new Image();
		const img3 = new Image();

		// user frame
		const loadImage1 = () => {
			img.onload = () =>  {
			loadImage2();
				uh = getFrame1Helpers(imageType, img.naturalWidth, img.naturalHeight, frame1, frameWidth, frameHeight, imageAnalysis);
		    	ctx.drawImage(img, uh.x, uh.y, uh.w, uh.h, uh.frameX, uh.frameY, uh.frameWidth, uh.frameHeight);
			};
			img.crossOrigin="anonymous";
			img.src = imageSource;
		}

		// user frame for mods
		const loadImage2 = () => {
			img2.onload = () => {
				loadImage3();
				uh2 = getFrame2Helpers(imageType, img.naturalWidth, img.naturalHeight, frame2, frameWidth, frameHeight, imageAnalysis);
		    	ctx.drawImage(img2, uh2.x, uh2.y, uh2.w, uh2.h, uh2.frameX, uh2.frameY, uh2.frameWidth, uh2.frameHeight);
		    }
			img2.crossOrigin="anonymous";
			img2.src = imageSource;
		};

		// creature
		const loadImage3 = () => {
			img3.onload = () => {
				ch = getCreatureHelpers(creature.name, img3.naturalWidth, img3.naturalHeight, frame3.x, frame3.y, frameWidth, frameHeight);
				ctx.drawImage(img3, ch.x, ch.y, ch.w, ch.h, ch.frameX, ch.frameY, ch.frameWidth, ch.frameHeight);
				saveToBlob();
			}
			img3.crossOrigin="anonymous";
			img3.src = getCreatureUrl(frameHeight.toFixed(0).toString(), creature.code, creature.name);
		}

		

		const saveToBlob = () => {
			this.setState({processing: false});

			const png = c.toDataURL();

			const newState = update(this.state, {
				imageBlob: {$set: png}
			});
			this.setState(newState);

			return getSecondAnalysis(png, KAIROS_ID, KAIROS_KEY, this.handleSecondAnalysis);
		}

		loadImage1();
	}

	drawCanvasWithObjects() {
		const {canvas, frame, imageAnalysis2, imageBlob, creature} = this.state;

		console.log(imageAnalysis2);
		const middleFace = imageAnalysis2.faces[0];

		const c = document.getElementById('c2');
		c.width = canvas.width;
		c.height = canvas.height;
		const ctx = c.getContext('2d');

		// helpers objs
		let oh1 = {};
		let oh2 = {};

		// image objs
		const img = new Image();
		const obj1 = new Image();
		const obj2 = new Image();

		// drawing funcs
		const loadImage1 = () => {
			img.onload = () =>  {
				loadObj1();
		    	ctx.drawImage(img, 0, 0, c.width, c.height);
			};
			img.crossOrigin="anonymous";
			img.src = imageBlob;
		}

		const loadObj1 = () => {
			obj1.onload = () => {
				loadObj2();
				oh1 = getObjectHelpers(creature, 0, frame, middleFace, obj1);
				ctx.drawImage(obj1, oh1.x, oh1.y);
				// ctx.fillStyle = "#F00";
				// ctx.rect(middleFace.rightEyeCenterX, middleFace.rightEyeCenterY, 12, 12);
				// ctx.fillStyle = "#F00";
				// ctx.rect(middleFace.leftEyeCenterX, middleFace.leftEyeCenterY, 12, 12);
				// ctx.fillStyle = "#F00"
				// ctx.rect(oh1.x + oh1.w/2, oh1.y + oh1.h/2, 12, 12);
				ctx.fill();
			}
			obj1.crossOrigin="anonymous";
			obj1.src = getObjectUrl(0, imageAnalysis2.faces[0], creature, frame);
		}

		const loadObj2 = () => {
			obj2.onload = () => {
				oh2 = getObjectHelpers(creature, 1, frame, middleFace, obj2);
				ctx.fillStyle = "#F00"
				// ctx.rect(oh2.x, oh2.y, 12, 12);
				// ctx.fill();
				ctx.drawImage(obj2, oh2.x, oh2.y);
			}
			obj2.crossOrigin="anonymous";
			obj2.src = getObjectUrl(1, imageAnalysis2.faces[0], creature, frame);
		}

		const getObjectHelpers = (creature, objectIndex, frame, face, obj) => {
			let o = {};

			switch(creature.name) {
				case 'joto':

				if (objectIndex === 0) {
					// check size of face against object before drawing
					console.log('* face width: ' + face.width + ' * obj width: ' + obj.naturalWidth);
					console.log('* face height: ' + face.height + ' * obj height: ' + obj.naturalHeight);

					let middleOfFaceX = face.topLeftX + face.width/2;
					let middleOfFaceY = face.topLeftY + face.height/2;
					// source
					o.x = face.rightEyeCenterX - obj.naturalWidth*.25;
					o.y = face.rightEyeCenterY - obj.naturalHeight*.70;
					o.w = obj.naturalWidth;
					o.h = obj.naturalHeight

					//dest


				} else {
					let mouthX = face.chinTipX;
					let mouthY = face.chinTipY - face.height/4;
					o.x = mouthX - obj.naturalWidth/2;
					o.y = mouthY - obj.naturalHeight*.55;
				}

				break;
			}

			return o;
		}

		loadImage1();
	}

	getFirstName(name) {
		let str = name;
		let s;

		s = str.substr(0, str.indexOf(' '));

		return s;
	}

	render() {
		if (this.state.loading && this.state.processing) {
			return (
				<Row center='xs'>
					<Col>
						<Loading type='bubbles' color={palette.red}/>
					</Col>
					<Col xs={12}>
						<HiddenCanvas id="c"></HiddenCanvas>
					</Col>
				</Row>
			);
		} else if (this.state.loading) {
			return (
				<Row center='xs'>
					<Col>
						<Loading type='bubbles' color={palette.red}/>
					</Col>
					<Col xs={12}>
						<canvas id="c2"></canvas>
					</Col>
				</Row>
			);
		} else {
			return(
				<Row center='xs'>
					<Col xs={12}>
						<H3> {this.getFirstName(this.props.user.name)}, te pareces al {this.state.creature.name} Extraordinario! </H3>
						<br></br>
					</Col>
					<Col xs={12}>
						<Canvas id="c3"></Canvas>
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