# mermaid

[![Deploy to Heroku][heroku-image]][heroku-url]
[![Build status][ci-image]][ci-url]

Automatically deploy Docker Images to Heroku from Dockerhub. When new images are pushed to Dockerhub, mermaid is notified and deploys these images on Heroku. One mermaid instance can be configured to receive webhooks from multiple dockerhub repositories, and to deploy to several heroku applications.

<img src="http://i.imgur.com/1alxlpl.png" height="200px">

## Usage

### 1. Setup Docker Remote API

Install Docker on a machine that the instance of mermaid can access over HTTP. Configure docker to listen on an external port so that the Docker Remote API can be accessed from the mermaid instance. The port `4550` is used as the default in the documentation examples.

#### Ubuntu

edit `/lib/systemd/system/docker.service`
```

ExecStart=/usr/bin/dockerd -H fd:// -H tcp://0.0.0.0:4550 $DOCKER_OPTS 
```

### 2. Setup Dockerhub Webhook

Once mermaid is deployed, configure a dockerhub webhook to notify it when new images are pushed.

<img src="http://i.imgur.com/ymI4c3U.png" height="200px">

### 3. Configure `mermaid`

#### Deploy Mapping
```js
// config/docker.js

```

#### Repository Credentials

environment vars...

## License
MIT

## Maintained By
[<img src='http://i.imgur.com/Y03Jgmf.png' height='64px'>](http://langa.io)

[ci-image]: https://img.shields.io/travis/langateam/mermaid/master.svg?style=flat-square
[ci-url]: https://travis-ci.org/langateam/mermaid
[heroku-image]: https://img.shields.io/badge/Deploy%20to%20Heroku-langa/mermaid-6762a6.svg?style=flat-square
[heroku-url]: https://heroku.com/deploy?template=https://github.com/langateam/mermaid
