export default function sketch (p) {
	let imgUrl = '';

	p.setup = () => {
		p.createCanvas(300, 300, p.WEBGL);
	}

	p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
		if (props.imgUrl) {

		}
	}

	p.draw = () => {

	}
}