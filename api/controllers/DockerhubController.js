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
    const { push_data, repository } = request.payload

    this.app.services.DockerService.deploy(push_data, repository)

    reply({ state: 'success' })
  }
}
