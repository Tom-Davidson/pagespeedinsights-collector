const dataextractor = require('../src/dataextractor');
const data = require('./response.json');

test('dataextractor.first_contentful_paint', () => {
	const fcp = dataextractor.first_contentful_paint(data);
	expect(fcp).toBe(660);
});
test('dataextractor.first_contentful_paint with bad data', () => {
	const fcp = dataextractor.first_contentful_paint(undefined);
	expect(fcp).toBe(undefined);
});
test('dataextractor.first_cpu_idle', () => {
	const fci = dataextractor.first_cpu_idle(data);
	expect(fci).toBe(2979);
});
test('dataextractor.interactive', () => {
	const tti = dataextractor.interactive(data);
	expect(tti).toBe(3137.5);
});
test('dataextractor.speed_index', () => {
	const si = dataextractor.speed_index(data);
	expect(si).toBe(1155.7224822875853);
});
test('dataextractor.max_potential_fid', () => {
	const mpf = dataextractor.max_potential_fid(data);
	expect(mpf).toBe(172);
});
test('dataextractor.first_meaningful_paint', () => {
	const fmp = dataextractor.first_meaningful_paint(data);
	expect(fmp).toBe(973);
});
test('dataextractor.performance_score', () => {
	const ps = dataextractor.performance_score(data);
	expect(ps).toBe(0.87);
});
