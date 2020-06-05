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
