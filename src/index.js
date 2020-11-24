const fs = require('fs');
const express = require('express');
const Prometheus = require('prom-client');
const promMid = require('express-prometheus-middleware');
const pagespeed = require('./pagespeed');
const dataextractor = require('./dataextractor');

const apiKey = process.env.APIKey;
const pages = process.env.PAGES.split(',').map((page) => page.trim());
const PORT = 3000;
var pollInterval = parseInt(process.env.POLL_INTERVAL_MINS,10); //minutes
if (isNaN(pollInterval)) {
	pollInterval = 1;
}


const metrics = {
	first_contentful_paint: new Prometheus.Gauge({
		name: 'pagespeed_first_contentful_paint_milliseconds',
		help: 'Time to first contentful paint, more info here: https://web.dev/first-contentful-paint/',
		labelNames: [ 'page' ]
	}),
	first_cpu_idle: new Prometheus.Gauge({
		name: 'pagespeed_first_cpu_idle_milliseconds',
		help: "First CPU Idle marks the first time at which the page's main thread is quiet enough to handle input.  https://web.dev/first-cpu-idle.",
		labelNames: [ 'page' ]
	}),
	interactive: new Prometheus.Gauge({
		name: 'pagespeed_interactive_milliseconds',
		help: "Time to interactive is the amount of time it takes for the page to become fully interactive. https://web.dev/interactive.",
		labelNames: [ 'page' ]
	}),
	speed_index: new Prometheus.Gauge({
		name: 'pagespeed_speed_index_seconds',
		help: "Speed Index, more info here: https://web.dev/speed-index",
		labelNames: [ 'page' ]
	}),
	max_potential_fid: new Prometheus.Gauge({
		name: 'pagespeed_max_potential_fid_seconds',
		help: "The maximum potential First Input Delay that your users could experience is the duration, in milliseconds, of the longest task. https://developers.google.com/web/updates/2018/05/first-input-delay",
		labelNames: [ 'page' ]
	}),
	first_meaningful_paint: new Prometheus.Gauge({
		name: 'pagespeed_first_meaningful_paint_seconds',
		help: "First Meaningful Paint measures when the primary content of a page is visible. https://web.dev/first-meaningful-paint",
		labelNames: [ 'page' ]
	}),
	performance_score: new Prometheus.Gauge({
		name: 'pagespeed_performance_score',
		help: "Performance Score",
		labelNames: [ 'page' ]
	}),
	accessibility_score: new Prometheus.Gauge({
		name: 'pagespeed_accessibility_score',
		help: "Accessibility Score",
		labelNames: [ 'page' ]
	}),
	mobile_first_contentful_paint: new Prometheus.Gauge({
		name: 'pagespeed_mobile_first_contentful_paint_milliseconds',
		help: 'Time to first contentful paint, more info here: https://web.dev/first-contentful-paint/',
		labelNames: [ 'page' ]
	}),
	mobile_first_cpu_idle: new Prometheus.Gauge({
		name: 'pagespeed_mobile_first_cpu_idle_milliseconds',
		help: "First CPU Idle marks the first time at which the page's main thread is quiet enough to handle input.  https://web.dev/first-cpu-idle.",
		labelNames: [ 'page' ]
	}),
	mobile_interactive: new Prometheus.Gauge({
		name: 'pagespeed_mobile_interactive_milliseconds',
		help: "Time to interactive is the amount of time it takes for the page to become fully interactive. https://web.dev/interactive.",
		labelNames: [ 'page' ]
	}),
	mobile_speed_index: new Prometheus.Gauge({
		name: 'pagespeed_mobile_speed_index_seconds',
		help: "Speed Index, more info here: https://web.dev/speed-index",
		labelNames: [ 'page' ]
	}),
	mobile_max_potential_fid: new Prometheus.Gauge({
		name: 'pagespeed_mobile_max_potential_fid_seconds',
		help: "The maximum potential First Input Delay that your users could experience is the duration, in milliseconds, of the longest task. https://developers.google.com/web/updates/2018/05/first-input-delay",
		labelNames: [ 'page' ]
	}),
	mobile_first_meaningful_paint: new Prometheus.Gauge({
		name: 'pagespeed_mobile_first_meaningful_paint_seconds',
		help: "First Meaningful Paint measures when the primary content of a page is visible. https://web.dev/first-meaningful-paint",
		labelNames: [ 'page' ]
	}),
	mobile_performance_score: new Prometheus.Gauge({
		name: 'pagespeed_mobile_performance_score',
		help: "Performance Score",
		labelNames: [ 'page' ]
	}),
	mobile_accessibility_score: new Prometheus.Gauge({
		name: 'pagespeed_mobile_accessibility_score',
		help: "Accessibility Score",
		labelNames: [ 'page' ]
	})
};

for (let page of pages) {
	setInterval(async () => {
		let desktopData = await pagespeed(page, apiKey, 'DESKTOP');
		if (desktopData != null) {
			try {
				metrics.first_contentful_paint.set({ page }, dataextractor.first_contentful_paint(desktopData));
				metrics.first_cpu_idle.set({ page }, dataextractor.first_cpu_idle(desktopData));
				metrics.interactive.set({ page }, dataextractor.interactive(desktopData));
				metrics.speed_index.set({ page }, dataextractor.speed_index(desktopData));
				metrics.max_potential_fid.set({ page }, dataextractor.max_potential_fid(desktopData));
				metrics.first_meaningful_paint.set({ page }, dataextractor.first_meaningful_paint(desktopData));
				metrics.performance_score.set({ page }, dataextractor.performance_score(desktopData));
				metrics.accessibility_score.set({ page }, dataextractor.accessibility_score(desktopData));
			} catch (e) {
				console.error(`data parsing failed, response dumped, url called: ${page}`);
				fs.writeFileSync('response.json', desktopData, { mode: 0o755 });
			}
		}
		let mobileData = await pagespeed(page, apiKey, 'MOBILE');
		if (mobileData != null) {
			try {
				metrics.mobile_first_contentful_paint.set({ page }, dataextractor.first_contentful_paint(mobileData));
				metrics.mobile_first_cpu_idle.set({ page }, dataextractor.first_cpu_idle(mobileData));
				metrics.mobile_interactive.set({ page }, dataextractor.interactive(mobileData));
				metrics.mobile_speed_index.set({ page }, dataextractor.speed_index(mobileData));
				metrics.mobile_max_potential_fid.set({ page }, dataextractor.max_potential_fid(mobileData));
				metrics.mobile_first_meaningful_paint.set({ page }, dataextractor.first_meaningful_paint(mobileData));
				metrics.mobile_performance_score.set({ page }, dataextractor.performance_score(mobileData));
				metrics.mobile_accessibility_score.set({ page }, dataextractor.accessibility_score(mobileData));
			} catch (e) {
				console.error(`data parsing failed, response dumped, url called: ${page}. Error: ${e.message}`);
				fs.writeFileSync('response.json', mobileData, { mode: 0o755 });
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
