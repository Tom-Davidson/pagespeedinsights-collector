const collect_numeric_from_audits = (data, key) => {
    return data.lighthouseResult.audits[key].numericValue;
}
const first_contentful_paint = (data) => {
    return collect_numeric_from_audits(data, 'first-contentful-paint')
};
const first_cpu_idle = (data) => {
    return collect_numeric_from_audits(data, 'first-cpu-idle')
};

module.exports = {
    first_contentful_paint,
    first_cpu_idle
};
