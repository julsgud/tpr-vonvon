export const isSafari = () => {
	let ua = navigator.userAgent.toLowerCase(); 
	// console.log(ua);
	if (ua.indexOf('safari') != -1) { 
	  if (ua.indexOf('chrome') > -1) {
	    return false; 
	    // alert("1") // Chrome
	  } else {
	    return true;
	    // alert("2") // Safari
	  }
	}
}

export const findCanvasDimensions = () => {
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

export const findFrameDimensions = (c) => {
	let f = {};

	f.xMargin = c.width/35;
	f.yMargin = c.height/13;
	f.width = (c.width - (f.xMargin * 4))/3;
	f.height = c.height - (f.yMargin * 2);

	return f;
}

export const getRandomBetween = (min, max) => {
	return Math.floor(Math.random() * (max - min)) + min;
}

export const getFrame1Helpers = (type, srcWidth, srcHeight, frame, frameWidth, frameHeight, imageAnalysis) => {
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
		let middleOfFaceX = boxX + boxWidth/2;
		let frameWidthByHalf = s.w/2;
		s.x = middleOfFaceX - frameWidthByHalf;
		s.y = 0;

		// frame dims
		s.frameX = frame.x;
		s.frameY = frame.y;
		s.frameWidth = frameWidth;
		s.frameHeight = frameHeight;

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

		s.frameX = frame.x;
		s.frameY = frame.y;
		s.frameWidth = frameWidth;
		s.frameHeight = frameHeight;

		return s;
	}
}

export const getFrame2Helpers = (type, srcWidth, srcHeight, frame, frameWidth, frameHeight, imageAnalysis) => {
	let s = {};
	const boxX = imageAnalysis.topLeftX;
	const boxWidth = imageAnalysis.width;
	const boxY = imageAnalysis.topLeftY;
	const boxHeight = imageAnalysis.height;

	if (type == 'landscape' || type == 'square') {
		// buffers
		let xBuffer = .5 * (frameWidth - boxWidth);
		let yBuffer = .5 * (frameHeight - boxHeight);

		// chunk in resized image that will be cropped
		s.w = boxWidth + xBuffer*2;
		s.h = boxHeight + yBuffer*2;

		// where to start cut
		s.x = boxX - xBuffer;
		s.y = boxY - yBuffer;

		// console.log('* boxW: ' + boxWidth + ' boxH: ' + boxHeight);
		// console.log('** srcWidth: ' + srcWidth + ' srcHeight: ' + srcHeight);
		// console.log('** frameWidth: ' + frameWidth.toFixed(2) + ' frameheight: ' + frameHeight.toFixed(2));
		// console.log('*** s.w: ' + s.w.toFixed(2) + ' s.h: ' + s.h.toFixed(2));
		// console.log('**** s.x: ' + s.x.toFixed(2) + ' s.y: ' + s.y.toFixed(2));
		// console.log('***** xBuffer: ' + xBuffer.toFixed(2) + ' yBuffer: ' + yBuffer.toFixed(2));
		// console.log('_________-------________-------');

		// Corrections
		// 1. If face is already large, keep it like in first frame
		if (boxWidth >= frameWidth || boxHeight >= frameHeight || boxWidth >= frameWidth - boxWidth*.15 || boxHeight >= frameHeight - boxHeight*.15) {
			// console.warn('correction 1');
			let newWidth = frameHeight * srcWidth / srcHeight;

			s.w = frameWidth * srcWidth / newWidth;
			s.h = srcHeight;

			let middleOfFaceX = boxX + boxWidth/2;
			let frameWidthByHalf = s.w/2;
			s.x = middleOfFaceX - frameWidthByHalf;
			s.y = 0;
		}

		// 2. If face is larger than 60% of image,
		// check if w or h of chunk is already large, to keep it like in first frame
		if (boxWidth > srcWidth*.30 || boxHeight > srcHeight*.30) {
			if (s.w >= srcWidth || s.h >= srcHeight || s.w >= srcWidth - (srcWidth*.15) || s.h >= (srcHeight*.15)) {
				// console.warn('correction 2');
				let newWidth = frameHeight * srcWidth / srcHeight;

				s.w = frameWidth * srcWidth / newWidth;
				s.h = srcHeight;

				let middleOfFaceX = boxX + boxWidth/2;
				let frameWidthByHalf = s.w/2;
				s.x = middleOfFaceX - frameWidthByHalf;
				s.y = 0;
			}
		}

		// 3. if negative cut points and box is less than half the chunk size, zoom in
		if (boxWidth < s.w *.3 || boxHeight < s.h * .3) {
			// console.warn('correction 3');
			let ratio = srcWidth/srcHeight;
			// console.log(ratio);

			let xBuffer = .5 * (frameWidth - boxWidth);
			let yBuffer = .5 * (frameHeight - boxHeight);

			// chunk in resized image that will be cropped
			s.w = boxWidth + xBuffer/2.5;
			s.h = boxHeight + yBuffer/1.9;
			// s.w = (boxWidth + xBuffer/2.5) * srcWidth / newWidth;
			// s.h = boxHeight + yBuffer/2.5;

			// where to start cut
			s.x = boxX - xBuffer/5;
			s.y = boxY - yBuffer/3.8;
		}

		// 4. If negative margin after corrections, back to first frame
		if (s.x < 0 || s.y < 0) {
			// console.warn('correction 4');
			let newWidth = frameHeight * srcWidth / srcHeight;

			s.w = frameWidth * srcWidth / newWidth;
			s.h = srcHeight;

			let middleOfFaceX = boxX + boxWidth/2;
			let frameWidthByHalf = s.w/2;
			s.x = middleOfFaceX - frameWidthByHalf;
			s.y = 0;
		}

		// console.log('* boxW: ' + boxWidth + ' boxH: ' + boxHeight);
		// console.log('** srcWidth: ' + srcWidth + ' srcHeight: ' + srcHeight);
		// console.log('** frameWidth: ' + frameWidth.toFixed(2) + ' frameheight: ' + frameHeight.toFixed(2));
		// console.log('*** s.w: ' + s.w.toFixed(2) + ' s.h: ' + s.h.toFixed(2));
		// console.log('**** s.x: ' + s.x.toFixed(2) + ' s.y: ' + s.y.toFixed(2));
		// console.log('***** xBuffer: ' + xBuffer.toFixed(2) + ' yBuffer: ' + yBuffer.toFixed(2));

		// frame dims
		s.frameX = frame.x;
		s.frameY = frame.y;
		s.frameWidth = frameWidth;
		s.frameHeight = frameHeight;

		return s;
	} else {
		// new
		let xBuffer = .5 * (frameWidth - boxWidth);
		let yBuffer = .5 * (frameHeight - boxHeight);

		// chunk in resized image that will be cropped
		s.w = boxWidth + xBuffer*2;
		s.h = boxHeight + yBuffer*2;

		// where to start cut
		s.x = boxX - xBuffer;
		s.y = boxY - yBuffer;

		// console.log('* boxW: ' + boxWidth + ' boxH: ' + boxHeight);
		// console.log('** srcWidth: ' + srcWidth + ' srcHeight: ' + srcHeight);
		// console.log('** frameWidth: ' + frameWidth.toFixed(2) + ' frameheight: ' + frameHeight.toFixed(2));
		// console.log('*** s.w: ' + s.w.toFixed(2) + ' s.h: ' + s.h.toFixed(2));
		// console.log('**** s.x: ' + s.x.toFixed(2) + ' s.y: ' + s.y.toFixed(2));
		// console.log('***** xBuffer: ' + xBuffer.toFixed(2) + ' yBuffer: ' + yBuffer.toFixed(2));
		// console.log('_________-------________-------');

		// Corrections
		// 1. If face is already large, keep it like in first frame
		if (boxWidth >= frameWidth || boxHeight >= frameHeight || boxWidth >= frameWidth - boxWidth*.15 || boxHeight >= frameHeight - boxHeight*.15) {
			// console.warn('correction 1');
			let newHeight = frameWidth * srcHeight / srcWidth;

			// width of chunk
			s.w = srcWidth;
			s.h = frameHeight * srcHeight / newHeight;

			// where to start cut
			s.x = 0;
			s.y = boxY - (Math.abs(boxHeight - s.h))/2;
		}

		// 2. If face is larger than 60% of image,
		// check if w or h of chunk is already large, to keep it like in first frame
		if (boxWidth > srcWidth*.30 || boxHeight > srcHeight*.30) {
			if (s.w >= srcWidth || s.h >= srcHeight || s.w >= srcWidth - (srcWidth*.15) || s.h >= (srcHeight*.15)) {
				// console.warn('correction 2');
				let newHeight = frameWidth * srcHeight / srcWidth;

				// width of chunk
				s.w = srcWidth;
				s.h = frameHeight * srcHeight / newHeight;

				// where to start cut
				s.x = 0;
				s.y = boxY - (Math.abs(boxHeight - s.h))/2;
			}
		}

		// 3. if negative cut points and box is less than half the chunk size, zoom in
		if (boxWidth < s.w *.3 || boxHeight < s.h * .3) {
			// console.warn('correction 3');
			let ratio = srcWidth/srcHeight;

			let xBuffer = .5 * (frameWidth - boxWidth);
			let yBuffer = .5 * (frameHeight - boxHeight);

			// chunk in resized image that will be cropped
			s.w = boxWidth + xBuffer/2.5;
			s.h = boxHeight + yBuffer/2.5;

			// where to start cut
			s.x = boxX - xBuffer/5;
			s.y = boxY - yBuffer/5;
		}

		// 4. If negative margin after corrections, back to first frame
		if (s.x < 0 || s.y < 0) {
			// console.warn('correction 4');
			let newHeight = frameWidth * srcHeight / srcWidth;

			// width of chunk
			s.w = srcWidth;
			s.h = frameHeight * srcHeight / newHeight;

			// where to start cut
			s.x = 0;
			s.y = boxY - (Math.abs(boxHeight - s.h))/2;
		}

		// console.log('* boxW: ' + boxWidth + ' boxH: ' + boxHeight);
		// console.log('** srcWidth: ' + srcWidth + ' srcHeight: ' + srcHeight);
		// console.log('** frameWidth: ' + frameWidth.toFixed(2) + ' frameheight: ' + frameHeight.toFixed(2));
		// console.log('*** s.w: ' + s.w.toFixed(2) + ' s.h: ' + s.h.toFixed(2));
		// console.log('**** s.x: ' + s.x.toFixed(2) + ' s.y: ' + s.y.toFixed(2));
		// console.log('***** xBuffer: ' + xBuffer.toFixed(2) + ' yBuffer: ' + yBuffer.toFixed(2));

		// frame dims
		s.frameX = frame.x;
		s.frameY = frame.y;
		s.frameWidth = frameWidth;
		s.frameHeight = frameHeight;

		return s;
	}
}