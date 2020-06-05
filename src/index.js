const fs = require('fs');
const express = require('express');
const Prometheus = require('prom-client');
const promMid = require('express-prometheus-middleware');
const pagespeed = require('./pagespeed');
const dataextractor = require('./dataextractor');

const apiKey = process.env.APIKey;
const pages = process.env.PAGES.split(',').map((page) => page.trim());
const PORT = 3000;
const pollInterval = 1; //minutes

const metrics = {
	first_contentful_paint: new Prometheus.Gauge({
		name: 'first_contentful_paint',
		help: 'Time to first contentful paint, more info here: https://web.dev/first-contentful-paint/',
		labelNames: [ 'page' ]
	}),
	first_cpu_idle: new Prometheus.Gauge({
		name: 'first_cpu_idle',
		help:
			"First CPU Idle marks the first time at which the page's main thread is quiet enough to handle input.  https://web.dev/first-cpu-idle.",
		labelNames: [ 'page' ]
	})
};

for (let page of pages) {
	setInterval(async () => {
		let data = await pagespeed(page, apiKey);
		if (data != null) {
			try {
				let ttfp = dataextractor.first_contentful_paint(data);
				metrics.first_contentful_paint.set({ page }, ttfp);
				metrics.first_cpu_idle.set({ page }, dataextractor.first_cpu_idle(data));
			} catch (e) {
				console.error(`data parsing failed, response dumped, url called: ${page}`);
				fs.writeFileSync('response.json', data, { mode: 0o755 });
			}
		}
	}, pollInterval * 60 * 1000);
}

const app = express();
app.use(
	// Prometheus endpoint
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
app.get('/healthz', (req, res) => {
	// Kubernetes liveness probe endpoint
	res.status(200).send();
});
app.listen(PORT, () => {
	console.log(`pagespeedinsights-collector is listening on http://localhost:${PORT}`);
});
