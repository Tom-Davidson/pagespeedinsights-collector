const pagespeed = require('./pagespeed');
const apiKey = process.env.APIKey;

(async () => {
    let page = 'https://developers.google.com';
	let data = await pagespeed(page, apiKey);
	console.log(data);
})();
