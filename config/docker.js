module.exports = {
  image: 'langa/underbuilt-server',
  tags: [
    {
      image: 'langa/underbuilt-server',
      expr: /^latest$/,
      app: 'underbuilt-server-edge',
      procType: 'web'
    },
    {
      image: 'langa/underbuilt-server',
      expr: /^v([0-9.]+)$/,
      app: 'underbuilt-server-staging',
      procType: 'web'
    },
    {
      image: 'langa/underbuilt-server',
      expr: /^final$/,
      app: 'underbuilt-server-prod',
      procType: 'web'
    }
  ],
  source: {
    registry: 'registry.hub.docker.com',
    auth: {
      username: process.env.DOCKER_SOURCE_AUTH_USERNAME,
      password: process.env.DOCKER_SOURCE_AUTH_PASSWORD,
      serveraddress: process.env.DOCKER_SOURCE_AUTH_SERVER
    }
  },
  dest: {
    registry: 'registry.heroku.com',
    auth: {
      username: process.env.DOCKER_DEST_AUTH_USERNAME,
      password: process.env.DOCKER_DEST_AUTH_PASSWORD,
      serveraddress: process.env.DOCKER_DEST_AUTH_SERVER
    }
  }
}
