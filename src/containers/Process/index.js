import React, {Component} from 'react';

import {Row, Col} from 'react-flexbox-grid';

import styled from 'styled-components';
import palette from 'palette';

import axios from 'axios';

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
	state = {
		imageInfo: null,
		tempImage: 'https://pbs.twimg.com/profile_images/2504839888/luxmfvs5xy8qfobo3m5t.jpeg'
	}

	componentWillMount() {
		return axios({
			method: 'post',
			url: 'https://api.kairos.com/detect',
			headers: {
				'Content-Type': 'application/json',
				app_id: KAIROS_ID,
				app_key: KAIROS_KEY
			},
			data: {
				'image': this.state.tempImage
			}
		}).then((response) => {
			console.log(response.data.images[0].faces[0]);
			this.setState({
				imageInfo: response.data.images[0].faces[0]
			})
		});
	}

	componentDidMount() {
		
	}

	componentDidUpdate() {
		/*
			1.Get canvas element and context
		*/
		const c = document.getElementById('c');
		const ctx = c.getContext('2d');
		const state = this.state;

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

		console.log('window: ' + window.innerWidth + 'px ** canvas: ' + c.width + 'px');

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
		const img = new Image();
		img.onload = function() {
		    ctx.drawImage(img, (img.naturalWidth - frameWidth)/2, 0, frameWidth, frameHeight, frame1.x, frame1.y, frameWidth, frameHeight);
		};
		img.src = this.state.tempImage;

		const img2 = new Image();
		img2.onload = function() {
		    ctx.drawImage(img2, (img2.naturalWidth - frameWidth)/2, 0, frameWidth, frameHeight, frame2.x, frame2.y, frameWidth, frameHeight);
		};
		img2.src = this.state.tempImage;

		const img3 = new Image();
		img3.onload = () => {
			ctx.globalAlpha = 0.5;
			ctx.drawImage(img3, frame2.x, frame2.y, frameWidth, frameHeight);
		}
		img3.src = 'https://res.cloudinary.com/julsgc/image/upload/c_scale,q_100,w_' + frameWidth.toFixed(0).toString() + '/v1491770566/Rey_gqihcs.png';

		const img4 = new Image();
		img4.onload = () => {
			ctx.globalAlpha = 1;
			ctx.drawImage(img4, frame3.x, frame3.y, frameWidth, frameHeight);
		}
		img4.src = 'https://res.cloudinary.com/julsgc/image/upload/c_scale,q_100,w_' + frameWidth.toFixed(0).toString() + '/v1491770566/Rey_gqihcs.png';
	}

	getFirstName(name) {
		let str = name;
		let s;

		s = str.substr(0, str.indexOf(' '));

		return s;
	}

	render() {
		const imgUrl = 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/14141904_10157493651325571_2937761036611221966_n.jpg?oh=3aa2092405c0b8ce9eefe3af8760095f&oe=59979D18';
	
		if (!this.state.imageInfo) {
			return (<div> Processing! </div>);
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
				</Row>
			);
		}
	}
}

Process.propTypes = {
	history: React.PropTypes.object
}

export default Process;