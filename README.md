# pagespeedinsights-collector

[![CircleCI](https://circleci.com/gh/Tom-Davidson/pagespeedinsights-collector.svg?style=svg&circle-token=ddeeca71dc44d011ec24408bc050c0d9098f6d1c)](https://circleci.com/gh/Tom-Davidson/pagespeedinsights-collector)
[Docker Hub](https://hub.docker.com/repository/docker/tomdavidson42/pagespeedinsights-collector)

Collect Google's PageSpeed Insights and graph over time.

## Installation

- [Sign up](https://developers.google.com/speed/docs/insights/v5/get-started) for a Pagespeed Insights API Key
- Edit the values in `helm/values.yaml` and `helm upgrade --install pagespeedinsights-collector ./helm/`
- or use `--set` to override the default values `helm upgrade --install --set APIKey=<yourPageSpeedInsightsAPIKey>,PAGES="https://www.example.com/" pagespeedinsights-collector ./helm/`

## Running a development environment

- From your local machine:
  - `cp .env.example .env` using your API key and list of pages to track.
  - `npm install`
  - `npm run dev:local`
  - Open [http://localhost:3000/metrics](http://localhost:3000/metrics) in your browser
- Via docker:
  - `cp .env.example .env` using your API key and list of pages to track.
  - `docker-compose up`
  - Available services:
    - [pagespeedinsights-collector](http://localhost:3000/metrics)
    - [prometheus](http://localhost:9090/)
  - if you make changes to `package.json` or `package-lock.json` please `rm -Rf ./node_modules/` in order for it to be re-installed from within the container
  - To check for smells using a local installation of sonarcube `docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:8.6.1-community` to start the local server, set your env vars with `SONAR_HOST_URL=http://localhost:9000 SONAR_LOGIN="YOUR_TOKEN_HERE" npm run test:sonar`. If you want to stop the local instance of sonarqube run `docker stop sonarqube`

## Running Tests

- `npm test` js unit tests and Dockerfile linting
- `npm run test:dockerfile:security` runs security best practice static analysis on the Dockerfile (not on CI currently)

## Debugging

- Direct access to the K8s service: `kubectl port-forward deployment/pagespeedinsights-collector 3000:3000`
