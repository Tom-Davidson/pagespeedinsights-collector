const fs = require('fs');
const express = require('express');
const Prometheus = require('prom-client');
const promMid = require('express-prometheus-middleware');
const { getPagespeedInsights, strategies } = require('./pagespeed');
const dataextractor = require('./dataextractor');

const apiKey = process.env.APIKey;
const pages = process.env.PAGES.split(',').map((page) => page.trim());
const PORT = 3000;

let pollInterval = parseInt(process.env.POLL_INTERVAL_MINS, 10); //minutes
if (isNaN(pollInterval)) {
	pollInterval = 1;
}

const pagespeedStrategies = {
	desktop: strategies.DESKTOP,
	mobile: strategies.MOBILE
};

const metrics = {
	[`first_contentful_paint`]: new Prometheus.Gauge({
		name: `pagespeed_first_contentful_paint_milliseconds`,
		help: 'Time to first contentful paint, more info here: https://web.dev/first-contentful-paint/',
		labelNames: ['page','strategy']
	}),
	[`interactive`]: new Prometheus.Gauge({
		name: `pagespeed_interactive_milliseconds`,
		help: `Time to interactive is the amount of time it takes for the page to become fully interactive. https://web.dev/interactive.`,
		labelNames: ['page','strategy']
	}),
	[`speed_index`]: new Prometheus.Gauge({
		name: `pagespeed_speed_index_seconds`,
		help: `Speed Index, more info here: https://web.dev/speed-index`,
		labelNames: ['page','strategy']
	}),
	[`max_potential_fid`]: new Prometheus.Gauge({
		name: `pagespeed_max_potential_fid_seconds`,
		help: `The maximum potential First Input Delay that your users could experience is the duration, in milliseconds, of the longest task. https://developers.google.com/web/updates/2018/05/first-input-delay`,
		labelNames: ['page','strategy']
	}),
	[`first_meaningful_paint`]: new Prometheus.Gauge({
		name: `pagespeed_first_meaningful_paint_seconds`,
		help: `First Meaningful Paint measures when the primary content of a page is visible. https://web.dev/first-meaningful-paint`,
		labelNames: ['page','strategy']
	}),
	[`performance_score`]: new Prometheus.Gauge({
		name: `pagespeed_performance_score`,
		help: `Performance Score`,
		labelNames: ['page','strategy']
	}),
	[`accessibility_score`]: new Prometheus.Gauge({
		name: `pagespeed_accessibility_score`,
		help: `Accessibility Score`,
		labelNames: ['page','strategy']
	}),
}

for (const strategy in pagespeedStrategies) {
	for (const page of pages) {
		setInterval(async () => {
			let data = await getPagespeedInsights(page, apiKey, pagespeedStrategies[strategy]);
			if (data != null) {														
				try {
					let labels = {page, strategy};
					metrics[`first_contentful_paint`].set(labels, dataextractor.first_contentful_paint(data));
					metrics[`interactive`].set(labels, dataextractor.interactive(data));
					metrics[`speed_index`].set(labels, dataextractor.speed_index(data));
					metrics[`max_potential_fid`].set(labels, dataextractor.max_potential_fid(data));
					metrics[`first_meaningful_paint`].set(labels, dataextractor.first_meaningful_paint(data));
					metrics[`performance_score`].set(labels, dataextractor.performance_score(data));
					metrics[`accessibility_score`].set(labels, dataextractor.accessibility_score(data));
				} catch (e) {
					console.log(e);
					console.error(`data parsing failed, response dumped, url called: ${page}`);
					fs.writeFileSync('response.json', data, {mode: 0o755});
				}
			}
		}, pollInterval * 60 * 1000);
	}
}

const app = express();
app.disable("x-powered-by");
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
