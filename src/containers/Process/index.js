import React, {Component} from 'react';

import {Row, Col} from 'react-flexbox-grid';

import styled from 'styled-components';
import palette from 'palette';

import Clarifai from 'clarifai';
import P5Wrapper from 'react-p5-wrapper';

const Img = styled.img`
	max-width: 100%;
	width: 200px;
`;

const H3 = styled.h3`
	color: ${palette.black};
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
		}
	}

	componentWillMount() {
		const imgUrl = "https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/14141904_10157493651325571_2937761036611221966_n.jpg?oh=3aa2092405c0b8ce9eefe3af8760095f&oe=59979D18";
		return cApp.models.predict("a403429f2ddf4b49b307e318f00e528b", imgUrl)
			.then((response) => {
				let x1, x2, y1, y2;
				let mT, mR, mB, mL;

				const box = response.outputs[0].data.regions[0].region_info.bounding_box;

				x1 = Number(box.top_row) * imageSize;
				mT = x1 - imageSize;
				y1 = Number(box.left_col) * imageSize;
				mL = y1 - imageSize;
				x2 = Number(box.bottom_row) * imageSize;
				mB = imageSize - x2;
				y2 = Number(box.right_col) * imageSize;
				mR = imageSize - y2;

				this.setState({margin: {
					top: mT.toString() + 'px',
					right: mR.toString() + 'px',
					bottom: mB.toString() + 'px',
					left: mL.toString() + 'px'
				}});
			});
	}

	render() {
		const imgUrl = "https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/14141904_10157493651325571_2937761036611221966_n.jpg?oh=3aa2092405c0b8ce9eefe3af8760095f&oe=59979D18";
		console.log(this.state.margin);
		if (!this.state.margin) {
			console.log('hey');
			return (<div> Processing! </div>);
		} else {
			console.log(this.state.margin);

			let imgStyle = {
				width: '200px',
				height: '200px',
				overflow: 'hidden',
				marginTop: this.state.margin.top,
				marginRight: this.state.margin.right,
				marginBottom: this.state.margin.bottom,
				marginLeft: this.state.margin.left
			};
			
			return(
				<Row center='xs'>
					<Col xs={12}>
						<H3> Here we go </H3>
						<Img id="i" src={imgUrl}></Img>
						<br></br>
						<Img id="i2" style={imgStyle} src={imgUrl}></Img>
					</Col>
					<Col xs={12}>
						<P5Wrapper sketch={sketch}/>
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