'use strict'

const Controller = require('trails/controller')

/**
 * @module DockerhubController
 * @description TODO document Controller.
 */
module.exports = class DockerhubController extends Controller {

  /**
   * Handle dockerhub webhook
   * see: https://docs.docker.com/docker-hub/webhooks/
   */
  webhook (request, reply) {
    const { push_data, repository /*, callback_url*/ } = request.payload

    this.app.services.DockerhubService.schedulePull(push_data, repository)

    reply({ state: 'success' })

    // POST to callback_url
  }
}
