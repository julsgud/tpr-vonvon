import axios from 'axios';

export const getFirstAnalysis = (image, KAIROS_ID, KAIROS_KEY, handleResponse, errorHandler, history) => {
	return axios({
		method: 'post',
		url: 'https://api.kairos.com/detect',
		headers: {
			'Content-Type': 'application/json',
			app_id: KAIROS_ID,
			app_key: KAIROS_KEY
		},
		data: {
			'image': image
		}
	}).then((response) => {
		checkForAnalysisErrors(response, errorHandler, history);			
		return handleResponse(response.data.images[0].faces[0]);
	}).catch((error) => {
		console.error(error);
	});
}

export const getSecondAnalysis = (image, KAIROS_ID, KAIROS_KEY, handleResponse, errorHandler, history) => {
	return axios({
		method: 'post',
		url: 'https://api.kairos.com/detect',
		headers: {
			'Content-Type': 'application/json',
			app_id: KAIROS_ID,
			app_key: KAIROS_KEY
		},
		data: {
			'image': image
		}
	}).then((response) => {			
		checkForAnalysisErrors(response, errorHandler, history);
		// console.log('***** log 2 - ');
		// console.log(response.data.images[0]);
		return handleResponse(response.data.images[0]);
	}).catch((error) => {
		console.error(error);
	});
}

const checkForAnalysisErrors = (response, errorHandler, history) => {
	if (analysisFailed(response)) {
		if (noFacesFound(response)) {
			errorHandler('No encontramos tu cara, escoge otra foto!');
			return history.push('/select');
		} else if (foundMultipleFaces(response)) {
			errorHandler('Trampa! Hay mas de una cara en esa foto, escoge otra!');
			return history.push('/select');
		}
	}
	return;
}

const noFacesFound = (response) => {
	let bool = false;

	if (response.data.Errors[0].ErrCode == 5002) {
		bool = true;
	}
	return bool;
}

const foundMultipleFaces = (response) => {
	let bool = false;

	if (response.data.images[0].faces.length > 1) {
		bool = true;
	}

	return bool;
}

const analysisFailed = (response) => {
	let bool = false;

	if (response.data.hasOwnProperty('Errors')) {
		bool = true;
	}

	return bool;
}