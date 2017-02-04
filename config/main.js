/**
 * Trailpack Configuration
 * (app.config.main)
 *
 * @see http://trailsjs.io/doc/config/main
 */

'use strict'

const path = require('path')

module.exports = {

  concurrency: process.env.WEB_CONCURRENCY || 1,

  /**
   * Order does *not* matter. Each module is loaded according to its own
   * requirements.
   */
  packs: [
    require('trailpack-router'),
    require('trailpack-hapi')
  ],

  /**
   * Define application paths here. "root" is the only required path.
   */
  paths: {
    root: path.resolve(__dirname, '..'),
    temp: path.resolve(__dirname, '..', '.tmp')
  }
}
