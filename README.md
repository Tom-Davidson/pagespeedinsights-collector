# pagespeedinsights-collector

[![CircleCI](https://circleci.com/gh/Tom-Davidson/pagespeedinsights-collector.svg?style=svg&circle-token=ddeeca71dc44d011ec24408bc050c0d9098f6d1c)](https://circleci.com/gh/Tom-Davidson/pagespeedinsights-collector)

Collect Google's PageSpeed Insights and graph over time.

## Installation

- [Sign up](https://developers.google.com/speed/docs/insights/v5/get-started) for a Pagespeed Insights API Key
- Create a K8s secret from your GitHub credentials: `kubectl create secret docker-registry githubdockerregistry --docker-server=docker.pkg.github.com --docker-username=<your-name> --docker-password=<your-github-api-token> --docker-email=<your-email>`
- Edit the values in `helm/values.yaml` and `helm upgrade --install pagespeedinsights-collector ./helm/`
- or use `--set` to override the default values `helm upgrade --install --set APIKey=<yourPageSpeedInsightsAPIKey>,PAGES="https://www.example.com/" pagespeedinsights-collector ./helm/`

## Running a development environment

- From your local machine:
  - `cp .env.example .env` using your API key and list of pages to track.
  - `npm install`
  - `npm run dev:local`
- Via docker:
  - `cp .env.example .env` using your API key and list of pages to track.
  - `docker-compose up`
  - if you make changes to `package.json` or `package-lock.json` please `rm -Rf ./node_modules/` in order for it to be re-installed from within the container

## Debugging

- Direct access to the K8s service: `kubectl port-forward deployment/pagespeedinsights-collector 3000:3000`
