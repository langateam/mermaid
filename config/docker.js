module.exports = {
  image: 'langa/underbuilt-server',
  tags: [
    {
      image: 'underbuilt-server',
      expr: /^latest$/,
      app: 'underbuilt-server-edge',
      procType: 'web'
    },
    {
      image: 'underbuilt-server',
      expr: /^v([0-9.]+)$/,
      app: 'underbuilt-server-staging',
      procType: 'web'
    },
    {
      image: 'underbuilt-server',
      expr: /^final$/,
      app: 'underbuilt-server-prod',
      procType: 'web'
    }
  ],
  source: {
    auth: {
      username: process.env.DOCKER_SOURCE_AUTH_USERNAME,
      password: process.env.DOCKER_SOURCE_AUTH_PASSWORD,
      email: process.env.DOCKER_SOURCE_AUTH_EMAIL,
      serveraddress: process.env.DOCKER_SOURCE_AUTH_SERVER
    }
  },
  dest: {
    auth: {
      username: process.env.DOCKER_DEST_AUTH_USERNAME,
      password: process.env.DOCKER_DEST_AUTH_PASSWORD,
      email: process.env.DOCKER_DEST_AUTH_EMAIL,
      serveraddress: process.env.DOCKER_DEST_AUTH_SERVER
    }
  }
}
