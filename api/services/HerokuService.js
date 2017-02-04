'use strict'

const Service = require('trails/service')

/**
 * @module HerokuService
 * @description TODO document Service
 */
module.exports = class HerokuService extends Service {

  deploy (fromImage, tag) {
    const DockerhubService = this.app.services.DockerhubService
    const pushTag = this.app.services.HerokuService.getTag(fromImage, tag)

    this.log.info(`pulling image ${fromImage}:${tag} from dockerhub...`)

    return DockerhubService.pull(fromImage, tag)
      .then(image => {
        this.log.info(`tagging image ${fromImage}:${tag} as ${pushTag}...`)
        return DockerhubService.updateTag(image, pushTag)
      })
      .then(image => {
        this.log.info(`pushing image ${pushTag} to heroku...`)
        return DockerhubService.push(image, pushTag)
      })
      .then(() => {
        this.log.info(`deploy of image ${pushTag} successful.`)
      })
      .catch(err => {
        this.log.error(err)
      })
  }

  /**
   * Get heroku tag template
   * see: https://devcenter.heroku.com/articles/container-registry-and-runtime#pushing-an-existing-image
   */
  getTag (fromImage, sourceTag) {
    const tags = this.app.config.docker.tags
    const { app, procType } = tags.find(tag => {
      return tag.expr.test(sourceTag) && (fromImage === tag.image)
    })
    return `registry.heroku.com/${app}/${procType}`
  }
}
