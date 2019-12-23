const url = require('url');
const express = require('express');
const Prometheus = require('prom-client');
const promMid = require('express-prometheus-middleware');
const pagespeed = require('./pagespeed');
const apiKey = process.env.APIKey;
const pages = process.env.PAGES.split(',').map((page) => page.trim());
const PORT = 3000;
const pollInterval = 1; //minutes

const fs = require('fs');

for (let page of pages) {
	urlparts = url.parse(page);
	let metric_name = `first_contentful_paint__${urlparts.hostname.replace(
		/[^a-zA-Z0-9]/g,
		'_'
	)}${urlparts.pathname.replace(/\/$/, '').replace(/[^a-zA-Z0-9]/g, '_')}`;
	let metric_help = `Time to first contentful paint for ${page}`;
	let gauge = new Prometheus.Gauge({ name: metric_name, help: metric_help });
	setInterval(async () => {
		let data = await pagespeed(page, apiKey);
		if (data != null) {
			try {
				let ttfp = data.lighthouseResult.audits['first-contentful-paint'].numericValue;
				gauge.set(ttfp);
			} catch (e) {
				console.log(`data parsing failed, response dumped, url called: ${page}`);
				fs.writeFileSync('response.json', data, { mode: 0o755 });
			}
		}
	}, pollInterval * 60 * 1000);
}

const app = express();
app.use(
	promMid({
		metricsPath: '/metrics',
		collectDefaultMetrics: true,
		requestDurationBuckets: [ 0.1, 0.5, 1, 1.5 ]
	})
);
app.get('/', (req, res) => {
	res.set('location', './metrics');
	res.status(301).send();
});
app.get('/healthz', (req, res) => { // Kubernetes liveness probe endpoint
	res.status(200).send();
});
app.listen(PORT, () => {
	console.log(`Example api is listening on http://localhost:${PORT}`);
});
