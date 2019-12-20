const express = require('express');
const Prometheus = require('prom-client');
const promMid = require('express-prometheus-middleware');
const pagespeed = require('./pagespeed');
const apiKey = process.env.APIKey;
const PORT = 3000;

const gauge = new Prometheus.Gauge({ name: 'test_metric_name', help: 'test_metric_help' });
gauge.set(10); // Set to 10
gauge.inc(); // Inc with 1

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
app.listen(PORT, () => {
	console.log(`Example api is listening on http://localhost:${PORT}`);
});

// (async () => {
//     let page = 'https://developers.google.com';
// 	let data = await pagespeed(page, apiKey);
// 	console.log(data);
// })();
