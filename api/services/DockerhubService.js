'use strict'

const Service = require('trails/service')
const sqs = require('sqs')
const Docker = require('node-docker-api').Docker

/**
 * @module DockerhubService
 * @description Handle the pull/push of Docker images
 */
module.exports = class DockerhubService extends Service {

  schedulePull (event, repo) {
    const fromImage = repo.repo_name
    const tag = event.tag

    this.log.info(`pushing ${fromImage}:${tag} to dockerhub-webhooks queue...`)
    return new Promise((resolve, reject) => {
      this.log.info(`pushed ${fromImage}:${tag} to dockerhub-webhooks queue.`)
      this.sqs.push('dockerhub-webhooks', { fromImage, tag }, resolve)
    })
  }

  pull (fromImage, tag) {
    const { auth, registry } = this.app.config.docker.source

    this.log.debug('pulling from', auth, registry)
    return this.docker.image.create(auth, { registry, fromImage: fromImage, tag })
      .then(stream => this.promisifyStream(stream))
      .then(() => this.docker.image.status(`${fromImage}:${tag}`))
  }

  push (image, tag) {
    const { auth, registry } = this.app.config.docker.dest

    this.log.debug('pushing to', auth, registry)
    return image.push(auth, { registry })
      .then(stream => this.promisifyStream(stream))
      .then(() => image.remove())
  }

  updateTag (image, tag) {
    return image.tag(tag)
  }

  constructor (app) {
    super(app)

    this.sqs = sqs(this.app.config.sqs.connection)
    this.docker = new Docker()

    if (this.app.config.env === 'worker') {
      setInterval(() => {
        this.sqs.pull('dockerhub-webhooks', (msg, cb) => {
          this.log.info('deploy sqs message received', msg)

          const { fromImage, tag } = msg
          this.app.services.HerokuService.deploy(fromImage, tag)
            .then(() => cb())
            .catch(err => this.log.error(err))
        })
      }, 5000)
    }
  }

  promisifyStream (stream) {
    return new Promise((resolve, reject) => {
      stream.on('end', resolve)
      stream.on('error', reject)
      stream.on('data', (d) => this.log.debug(d.status, d.progressDetail))
    })
  }
}

