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

const metrics = {}

function define_metric(key,name,help) {
	metrics[key] = new Prometheus.Gauge({
		name: name,
		help: help,
		labelNames: ['page','strategy']
	});
	metrics[`${key}_desktop`] = new Prometheus.Gauge({
		name: `${name}_desktop`,
		help: help,
		labelNames: ['page']
	});
	metrics[`${key}_mobile`] = new Prometheus.Gauge({
		name: `${name}_mobile`,
		help: help,
		labelNames: ['page']
	});
}

function add_metric(name, page, strategy, metric)
{
	metrics[name].set( {page, strategy}, metric);
	metrics[`${name}_${strategy}`].set( {page}, metric );
}

define_metric(`first_contentful_paint`,
			`pagespeed_first_contentful_paint_milliseconds`,
			'Time to first contentful paint, more info here: https://web.dev/first-contentful-paint/');

define_metric('interactive',
			'pagespeed_interactive_milliseconds',
			`Time to interactive is the amount of time it takes for the page to become fully interactive. https://web.dev/interactive.`);

define_metric('speed_index',
			'pagespeed_speed_index_seconds',
			`Speed Index, more info here: https://web.dev/speed-index`);

define_metric('max_potential_fid',
			'pagespeed_max_potential_fid_seconds',
			`The maximum potential First Input Delay that your users could experience is the duration, in milliseconds, of the longest task. https://developers.google.com/web/updates/2018/05/first-input-delay`);

define_metric('first_meaningful_paint',
			'pagespeed_first_meaningful_paint_seconds',
			`First Meaningful Paint measures when the primary content of a page is visible. https://web.dev/first-meaningful-paint`);

define_metric('performance_score',
			'pagespeed_performance_score',
			`Performance Score`);

define_metric('accessibility_score',
			'pagespeed_accessibility_score',
			`Accessibility Score`);

for (const strategy in pagespeedStrategies) {
	for (const page of pages) {
		setInterval(async () => {
			let data = await getPagespeedInsights(page, apiKey, pagespeedStrategies[strategy]);
			if (data != null) {														
				try {
					add_metric('first_contentful_paint', page, strategy, dataextractor.first_contentful_paint(data));
					add_metric('interactive', page, strategy, dataextractor.interactive(data));
					add_metric('speed_index', page, strategy, dataextractor.speed_index(data));
					add_metric('max_potential_fid', page, strategy, dataextractor.max_potential_fid(data));
					add_metric('first_meaningful_paint', page, strategy, dataextractor.first_meaningful_paint(data));
					add_metric('performance_score', page, strategy, dataextractor.performance_score(data));
					add_metric('accessibility_score', page, strategy, dataextractor.accessibility_score(data));
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
