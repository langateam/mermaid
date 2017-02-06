'use strict'

const Service = require('trails/service')

/**
 * @module HerokuService
 * @description TODO document Service
 */
module.exports = class HerokuService extends Service {

  deploy (fromImage, tag) {
    const DockerhubService = this.app.services.DockerhubService
    const sourceRepo = `${fromImage}:${tag}`
    const pushTag = this.app.services.HerokuService.getTag(fromImage, tag)

    this.log.info(`pulling image ${fromImage}:${tag}...`)

    return DockerhubService.pull(fromImage, tag)
      .then(image => {
        this.log.info(`tagging image ${fromImage}:${tag} as ${pushTag}...`)
        return DockerhubService.updateTag(sourceRepo, pushTag)
      })
      .then(image => {
        this.log.info(`pushing image ${pushTag}...`)
        return DockerhubService.push(sourceRepo, pushTag)
      })
      .then(() => {
        this.log.info(`deploy of image ${pushTag} successful.`)
      })
      .catch(err => {
        this.log.error(err)
      })
  }

}
