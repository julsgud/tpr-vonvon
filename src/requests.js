import axios from 'axios';

export const getAnalysis() {
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
		console.log(response.data.images[0]);
		return response.data.images[0];
	}).catch((error) => {
		console.error(error);
	});
}