const collect_numeric_from_audits = (data, key) => {
	if (
        data &&
		data.lighthouseResult &&
		data.lighthouseResult.audits &&
		data.lighthouseResult.audits[key] &&
		data.lighthouseResult.audits[key].numericValue
	) {
		return data.lighthouseResult.audits[key].numericValue;
	} else {
		return undefined;
	}
};
const first_contentful_paint = (data) => {
	return collect_numeric_from_audits(data, 'first-contentful-paint');
};
const first_cpu_idle = (data) => {
	return collect_numeric_from_audits(data, 'first-cpu-idle');
};

module.exports = {
	first_contentful_paint,
	first_cpu_idle
};
