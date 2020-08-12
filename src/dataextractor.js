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
const interactive = (data) => {
	return collect_numeric_from_audits(data, 'interactive');
};
const speed_index = (data) => {
	return collect_numeric_from_audits(data, 'speed-index');
};
const max_potential_fid = (data) => {
	return collect_numeric_from_audits(data, 'max-potential-fid');
};
const first_meaningful_paint = (data) => {
	return collect_numeric_from_audits(data, 'first-meaningful-paint');
};
const performance_score = (data) => {
	if (data && 
		data.lighthouseResult && 
		data.lighthouseResult.categories && 
		data.lighthouseResult.categories.performance &&
		data.lighthouseResult.categories.performance.score
	) {
		return data.lighthouseResult.categories.performance.score;
	}
	return undefined;
};

module.exports = {
	first_contentful_paint,
	first_cpu_idle,
	interactive,
	speed_index,
	max_potential_fid,
	first_meaningful_paint,
	performance_score
};
