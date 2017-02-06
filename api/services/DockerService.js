'use strict'

const Service = require('trails/service')
const request = require('request-promise')
const qs = require('qs')

/**
 * @module DockerService
 * @description Docker Remote API
 */
module.exports = class DockerService extends Service {

  pull (imageName, tag) {
    const { version, engine: { host, port }, registries: { source } } = this.config
    const imageId = `${source.host}/${imageName}:${tag}`
    const query = {
      fromImage: `${source.host}/${imageName}`,
      tag
    }
    const queryString = qs.stringify(query)
    const opts = {
      method: 'POST',
      uri: `http://${host}:${port}/${version}/images/create?${queryString}`,
      headers: {
        'X-Registry-Auth': this.registries.source.auth
      }
    }

    this.log.debug('pulling image', opts)
    return request(opts).then(r => {
      this.log.debug('pull r', r)
      return imageId
    })
  }

  push (imageId) {
    const { version, engine: { host, port } } = this.config
    const opts = {
      method: 'POST',
      uri: `http://${host}:${port}/${version}/images/${imageId}/push`,
      headers: {
        'X-Registry-Auth': this.registries.target.auth
      }
    }
    this.log.info(`pushing image ${imageId}...`)
    return request(opts).then(r => {
      this.log.debug('push r', r)
      return imageId
    })
  }

  updateTag (imageName, tag, imageId) {
    const { version, engine: { host, port } } = this.config
    const query = {
      repo: this.getImageName(imageName, tag)
    }
    const queryString = qs.stringify(query)
    const opts = {
      method: 'POST',
      uri: `http://${host}:${port}/${version}/images/${imageId}/tag?${queryString}`
    }

    this.log.info(`tagging image ${imageId} as ${query.repo}...`)
    return request(opts).then(() => query.repo)
  }

  /**
   * Map tag to deploy registry
   * see: https://devcenter.heroku.com/articles/container-registry-and-runtime#pushing-an-existing-image
   */
  getImageName (imageName, tag) {
    this.log.debug('getImageName', imageName, tag)
    const tags = this.app.config.docker.tags
    const { registries: { target } } = this.config
    const { deployImage } = tags.find(tagMapping => {
      return tagMapping.expr.test(tag) && (imageName === tagMapping.image)
    })
    return `${target.host}/${deployImage}`
  }

  deploy (pushData, repository) {
    const fromImage = repository.repo_name
    const tag = pushData.tag

    return this.pull(fromImage, tag)
      .then(imageId => this.updateTag(fromImage, tag, imageId))
      .then(imageId => this.push(imageId))
      .then(imageId => {
        this.log.info(`deploy of image ${imageId} successful.`)
      })
      .catch(err => {
        this.log.error(err)
      })
  }

  constructor (app) {
    super(app)

    this.config = this.app.config.docker
    const { source, target } = this.config.registries

    this.registries = {
      source: {
        auth: new Buffer(JSON.stringify(source.auth)).toString('base64')
      },
      target: {
        auth: new Buffer(JSON.stringify(target.auth)).toString('base64')
      }
    }

    this.log.debug('registries', this.config.registries)
    this.log.debug('registries', this.registries)
  }
}

