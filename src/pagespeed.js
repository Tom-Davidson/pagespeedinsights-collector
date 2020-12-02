const axios = require('axios');

const strategies = {
	DESKTOP: 'DESKTOP',
	MOBILE: 'MOBILE'
};

const getPagespeedInsights = async (page, apiKey, strategy) => {
	if (strategy in strategies) {
		let url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${page}&key=${apiKey}&category=PERFORMANCE&category=ACCESSIBILITY&strategy=${strategy}`;
		try {
			const response = await axios.get(url);
			return response.data;
		} catch (error) {
			console.error(`Error fetching ${page} - ${error}`)
			return null;
		}
	} else {
		throw `${strategy} is not a valid strategy!`;
	}
};

module.exports = {
	strategies,
	getPagespeedInsights
}
