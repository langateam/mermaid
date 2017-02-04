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
    const auth = this.app.config.docker.source.auth

    return this.docker.image.create(auth, { fromImage, tag })
      .then(DockerhubService.promisifyStream)
  }

  push (image, tag) {
    const auth = this.app.config.docker.dest.auth

    return image.push(auth)
      .then(DockerhubService.promisifyStream)
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
      this.sqs.pull('dockerhub-webhooks', (msg, cb) => {
        this.log.info('deploy sqs message received', msg)

        const { fromImage, tag } = msg
        this.app.services.HerokuService.deploy(fromImage, tag)
          .then(() => cb())
      })
    }
  }

  static promisifyStream (stream) {
    return new Promise((resolve, reject) => {
      stream.on('end', resolve)
      stream.on('error', reject)
    })
  }

}

