# pagespeedinsights-collector

[![CircleCI](https://circleci.com/gh/Tom-Davidson/pagespeedinsights-collector.svg?style=svg&circle-token=ddeeca71dc44d011ec24408bc050c0d9098f6d1c)](https://circleci.com/gh/Tom-Davidson/pagespeedinsights-collector)

Collect Google's PageSpeed Insights and graph over time.

## Installation

- Create a K8s secret from your GitHub credentials: `kubectl create secret docker-registry githubdockerregistry --docker-server=docker.pkg.github.com --docker-username=<your-name> --docker-password=<your-github-api-token> --docker-email=<your-email>`
- Edit the values in `helm/values.yaml` and `helm upgrade --install pagespeedinsights-collector ./helm/`
- or use `--set` to override the default values `helm upgrade --install --set APIKey=<yourPageSpeedInsightsAPIKey>,PAGES="https://www.example.com/" pagespeedinsights-collector ./helm/`

## Debugging

- Direct access to the K8s service: `kubectl port-forward deployment/pagespeedinsights-collector 3000:3000`
