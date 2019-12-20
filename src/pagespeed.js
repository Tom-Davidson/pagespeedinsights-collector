const axios = require('axios');

module.exports = async function(page, apiKey) {
	let url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${page}&key=${apiKey}`;
	console.log(`fetching ${url}`);
	try {
		const response = await axios.get(url);
		const data = response.data;
		return data;
	} catch (error) {
		return error;
	}
};
