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

    this.sqs.push('dockerhub-webhooks', { fromImage, tag })
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
  }

  static promisifyStream (stream) {
    return new Promise((resolve, reject) => {
      stream.on('end', resolve)
      stream.on('error', reject)
    })
  }

}

