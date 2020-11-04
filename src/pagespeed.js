const axios = require('axios');

module.exports = async function(page, apiKey) {
	let url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${page}&key=${apiKey}&category=PERFORMANCE&category=ACCESSIBILITY`;
	try {
		const response = await axios.get(url);
		const data = response.data;
		return data;
	} catch (error) {
		console.error(`Error fetching ${page} - ${error}`)
		return null;
	}
};
