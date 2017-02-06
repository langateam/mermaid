'use strict'

const Service = require('trails/service')

/**
 * @module DockerhubService
 * @description Handle the pull/push of Docker images
 */
module.exports = class DockerhubService extends Service {

  schedulePull (event, repo) {
    const fromImage = repo.repo_name
    const tag = event.tag

    //this.log.info(`pushing ${fromImage}:${tag} to dockerhub-webhooks queue...`)

    return this.app.services.HerokuService.deploy(fromImage, tag)
    /*
    return new Promise((resolve, reject) => {
      this.log.info(`pushed ${fromImage}:${tag} to dockerhub-webhooks queue.`)
      this.sqs.push('dockerhub-webhooks', { fromImage, tag }, resolve)
    })
    */
  }

  pull (fromImage, tag) {
    const { auth } = this.app.config.docker.engine
    const registry = this.app.config.docker.registries.source

    this.log.debug('pulling from', auth, registry)
    return this.docker.image.create(auth, { fromImage: fromImage, tag })
      .then(stream => this.promisifyStream(stream))
      .then(() => this.docker.image.status(`${fromImage}:${tag}`))
  }

  push (sourceRepo, pushTag) {
    const { auth } = this.app.config.docker.engine
    const registry = this.app.config.docker.registries.target

    this.log.debug('pushing to', auth, registry, sourceRepo)
    return this.docker.image.push(auth, { registry }, sourceRepo)
      .then(stream => this.promisifyStream(stream))
      //.then(() => this.docker.image.remove(sourceRepo))
  }

  updateTag (sourceRepo, repo) {
    return this.docker.image.tag({ repo }, sourceRepo)
  }

  promisifyStream (stream) {
    return new Promise((resolve, reject) => {
      stream.on('end', () => {
        this.log.debug('docker stream status: done')
        resolve()
      })
      stream.on('error', reject)
      stream.on('data', d => {
        this.log.debug('docker stream status:', d.toString())
        try {
          //const obj = JSON.parse(d.toString())
          //this.log.debug('docker stream status:', obj.status)
        }
        catch (e) {
          //
        }
      })
    })
  }

  constructor (app) {
    super(app)

    //const engine = this.app.config.docker.engine

    //this.sqs = sqs(this.app.config.sqs.connection)
    //this.docker = new Docker({

    /*
    this.log.info('listening for dockerhub webhooks via sqs...')
    this.sqs.pull('dockerhub-webhooks', (msg, cb) => {
      this.log.info('deploy sqs message received', msg)

      const { fromImage, tag } = msg
      this.app.services.HerokuService.deploy(fromImage, tag)
        .then(() => cb())
        .catch(err => this.log.error(err))
    })
    */
  }
}

