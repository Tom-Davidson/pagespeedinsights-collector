const axios = require('axios');

const viewports = {
	DESKTOP: 'DESKTOP',
	MOBILE: 'MOBILE'
};

const getPagespeedInsights = async (page, apiKey, viewport) => {
	let url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${page}&key=${apiKey}&category=PERFORMANCE&category=ACCESSIBILITY&strategy=${viewport}`;
	try {
		const response = await axios.get(url);
		return response.data;
	} catch (error) {
		console.error(`Error fetching ${page} - ${error}`)
		return null;
	}
};

module.exports = {
	viewports,
	getPagespeedInsights
}
