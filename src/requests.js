import axios from 'axios';

export const getSecondAnalysis = (png, KAIROS_ID, KAIROS_KEY, handleResponse) => {
	return axios({
		method: 'post',
		url: 'https://api.kairos.com/detect',
		headers: {
			'Content-Type': 'application/json',
			app_id: KAIROS_ID,
			app_key: KAIROS_KEY
		},
		data: {
			'image': png
		}
	}).then((response) => {			
		// console.log(response.data.images[0]);
		return handleResponse(response.data.images[0]);
	}).catch((error) => {
		console.error(error);
	});
}