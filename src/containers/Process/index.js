import React, {Component} from 'react';

import {Row, Col} from 'react-flexbox-grid';
import Loading from 'react-loading';
import axios from 'axios';
import styled from 'styled-components';
import update from 'immutability-helper';

import Share from 'components/Share';

import palette from 'palette';
import {getSecondAnalysis} from 'requests';
import {pickCreature, getCreatureUrl, getCreatureHelpers} from 'creatures';
import {getFrame1Helpers, getFrame2Helpers, getRandomBetween} from 'helpers';

const Img = styled.img`
`;

const H3 = styled.h3`
	color: ${palette.black};
`;

const HiddenCanvas = styled.canvas`
	/*display: none;*/
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
			canvas: {},
			frame: {}
		};

		this.handleSecondAnalysis = this.handleSecondAnalysis.bind(this);
	}

	componentWillMount() {
		let c = this.findCanvasDimensions();

		let f = this.findFrameDimensions(c);

		let t = this.findImageType(this.props.image);

		let i = this.findLargestImage();

		let cr = pickCreature(getRandomBetween(0, 4));

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

		console.log(c);

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
			console.log('ready to draw');
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
						<HiddenCanvas id="c2"></HiddenCanvas>
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