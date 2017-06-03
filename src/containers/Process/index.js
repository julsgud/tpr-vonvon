import React, {Component} from 'react';

import {Row, Col} from 'react-flexbox-grid';
import Loading from 'react-loading';
import axios from 'axios';
import styled from 'styled-components';
import update from 'immutability-helper';
import cloudinary from 'cloudinary';

import FacebookShare from 'components/FacebookShare';

import palette from 'palette';
import {getFirstAnalysis, getSecondAnalysis} from 'requests';
import {pickCreature, getCreatureUrl, getObjectUrl, getStarUrl, getCreatureHelpers, getCreatureDescription, getObjectHelpers} from 'creatures';
import {findCanvasDimensions, findFrameDimensions, getFrame1Helpers, getFrame2Helpers, getRandomBetween} from 'helpers';

const Img = styled.img`
	max-width: 100%;
`;

const H3 = styled.h3`
	/*color: ${palette.black};*/
	margin-bottom: 0;
`;

const HiddenCanvas = styled.canvas`
	display: none;
`;

const P = styled.p`
	color: palette.blue;
`;

const KAIROS_ID = '69e02886';
const KAIROS_KEY = '6423bdb83597bcfe304c3752576a190d';

class Process extends Component {
	constructor(props) {
		super(props);

		this.state = {
			image: null,
			imageBlob: null,
			finalBlob: null,
			finalImage: null,
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
			canvas: {},
			frame: {}
		};

		this.handleFirstAnalysis = this.handleFirstAnalysis.bind(this);
		this.handleSecondAnalysis = this.handleSecondAnalysis.bind(this);
	}

	componentWillMount() {
		const c = findCanvasDimensions();

		const f = findFrameDimensions(c);

		const t = this.findImageType(this.props.image);

		const i = this.findLargestImage();

		const cr = pickCreature(getRandomBetween(0, 4));
		// const cr = pickCreature(4);
		this.props.songHandler(cr.song);

		const g = this.props.user.gender;

		let newState = update(this.state, {
			canvas: {$set: c},
			frame: {$set: f},
			image: {$set: i},
			imageSource: {$set: i.source},
			imageType: {$set: t},
			creature: {$set: cr},
			gender: {$set: g}
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
		return getFirstAnalysis(this.state.imageSource, KAIROS_ID, KAIROS_KEY, this.handleFirstAnalysis, this.props.errorHandler, this.props.history);
	}

	componentDidUpdate() {
		if (this.state.loading && this.state.firstAnalysis && this.state.processing) {
			this.drawCanvasForSecondAnalysis();
		} else if (this.state.loading && this.state.secondAnalysis) {
			this.drawCanvasWithObjects();
		}
	}

	handleFirstAnalysis(response) {
		const data = response;
		const newState = update(this.state, {
			imageAnalysis: {$set: data},
			firstAnalysis: {$set: true}
		});
		this.setState(newState, () => {
			// console.log(this.state);
		});
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
		const star0 = new Image();
		const star1 = new Image();
		const star2 = new Image();
		const star3 = new Image();

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
				// ctx.globalAlpha = 0.5;
				// ctx.fillStyle = palette.ylw;		    	
				// ctx.fillRect(frame2.x - 1.5, frame2.y - 1.5, frameWidth + 3, frameHeight + 3);
				// ctx.globalAlpha = 1;
		    	ctx.drawImage(img2, uh2.x, uh2.y, uh2.w, uh2.h, uh2.frameX, uh2.frameY, uh2.frameWidth, uh2.frameHeight);
		    }
			img2.crossOrigin="anonymous";
			img2.src = imageSource;
		};

		// creature
		const loadImage3 = () => {
			img3.onload = () => {
				loadStar0();
				ch = getCreatureHelpers(creature.name, img3.naturalWidth, img3.naturalHeight, frame3.x, frame3.y, frameWidth, frameHeight);
				ctx.drawImage(img3, ch.x, ch.y, ch.w, ch.h, ch.frameX, ch.frameY, ch.frameWidth, ch.frameHeight);
			}
			img3.crossOrigin="anonymous";
			img3.src = getCreatureUrl(frameHeight.toFixed(0).toString(), creature.code, creature.name);
		}

		const loadStar0 = () => {
			star0.onload = () => {
				loadStar1();
				ctx.drawImage(star0, frame2.x - star0.naturalWidth/2, frame2.y - star0.naturalHeight/2);
			}
			star0.crossOrigin = 'anonymous';
			star0.src = getStarUrl(0);
		}

		const loadStar1 = () => {
			star1.onload = () => {
				loadStar2();
				ctx.drawImage(star1, frame2.x + frameWidth - star1.naturalWidth/2, frame2.y - star1.naturalHeight/2.6);
			}
			star1.crossOrigin = 'anonymous';
			star1.src = getStarUrl(1);
		}

		const loadStar2 = () => {
			star2.onload = () => {
				loadStar3();
				ctx.drawImage(star2, frame2.x + frameWidth - star2.naturalWidth/1.8, frame2.y + frameHeight - star2.naturalHeight/1.5);
			}
			star2.crossOrigin = 'anonymous';
			star2.src = getStarUrl(2);
		}
		const loadStar3 = () => {
			star3.onload = () => {
				ctx.drawImage(star3, frame2.x - star3.naturalWidth/2, frame2.y + frameHeight - star3.naturalHeight/1.8);
				getBlobForAnalysis();
			}
			star3.crossOrigin = 'anonymous';
			star3.src = getStarUrl(3);
		}

		const getBlobForAnalysis = () => {
			this.setState({processing: false});

			const png = c.toDataURL();

			const newState = update(this.state, {
				imageBlob: {$set: png}
			});
			this.setState(newState);

			return getSecondAnalysis(png, KAIROS_ID, KAIROS_KEY, this.handleSecondAnalysis, this.props.errorHandler, this.props.history);
		}

		loadImage1();
	}

	drawCanvasWithObjects() {
		const {canvas, frame, imageAnalysis2, imageBlob, creature} = this.state;
		let middleFace;

		for (let i = 0; i < imageAnalysis2.faces.length; i++) {
			if (imageAnalysis2.faces[i].chinTipX > 300) {
				middleFace = imageAnalysis2.faces[i];
				break;
			}
		}

		console.log('***** log 1 - ' + middleFace);
		
		const c = document.getElementById('c2');
		c.width = canvas.width;
		c.height = canvas.height;
		const ctx = c.getContext('2d');

		// helpers objs
		let oh1 = {};
		let oh2 = {};
		let oh3 = {};

		// image objs
		const img = new Image();
		const obj1 = new Image();
		const obj2 = new Image();
		const obj3 = new Image();

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
				ctx.fill();
			}
			obj1.crossOrigin="anonymous";
			obj1.src = getObjectUrl(0, middleFace, creature, frame);
		}

		const loadObj2 = () => {
			obj2.onload = () => {
				if (creature.objectCount > 2) loadObj3();
				oh2 = getObjectHelpers(creature, 1, frame, middleFace, obj2);
				ctx.fillStyle = "#F00"
				ctx.drawImage(obj2, oh2.x, oh2.y);
				if (creature.objectCount < 3) getFinalBlob();
			}
			obj2.crossOrigin="anonymous";
			obj2.src = getObjectUrl(1, middleFace, creature, frame);
		}
		const loadObj3 = () => {
			obj3.onload = () => {
				oh3 = getObjectHelpers(creature, 2, frame, middleFace, obj3);
				ctx.fillStyle = "#F00"
				ctx.drawImage(obj3, oh3.x, oh3.y);
				getFinalBlob();
			}
			obj3.crossOrigin="anonymous";
			obj3.src = getObjectUrl(2, middleFace, creature, frame);
		}

		const getFinalBlob = () => {
			const png = c2.toDataURL();

			const newState = update(this.state, {
				finalImage: {$set: png},
				loading: {$set: false}
			});

			return this.setState(newState, () => {
				// console.log(this.state);
			});

			// return cloudinary.uploader.upload(png, (response) => {
			// 	// console.log(response);
			// 	const imgUrl = response.secure_url;

			// 	const newState = update(this.state, {
			// 		finalImage: {$set: imgUrl},
			// 		loading: {$set: false}
			// 	});
			// 	return this.setState(newState, () => {
			// 		console.log(this.state);
			// 	});
			// });
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
						<HiddenCanvas id="c2"></HiddenCanvas>
					</Col>
				</Row>
			);
		} else {
			const description = getCreatureDescription(this.state.creature, this.props.user.gender);
			const title = this.getFirstName(this.props.user.name) + ', te pareces ' + this.state.creature.title;
			const titleFB = this.getFirstName(this.props.user.name) + ' se parece ' + this.state.creature.title;

			return (
				<Row center='xs'>
					<Col xs={12}>
						<h3> {title} </h3>
					</Col>
					<Col xs={12}>
						<Img id="i" src={this.state.finalImage}></Img>
					</Col>
					<Col xs={6}>
						<FacebookShare title={titleFB} image={this.state.finalImage}/>
					</Col>
					<Col xs={12}>
						<P> {description} </P>
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