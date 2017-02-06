module.exports = {
  version: 'v1.25',
  tags: [
    {
      image: 'langa/underbuilt-server',
      expr: /^latest$/,
      deployImage: 'underbuilt-server-edge/web'
    },
    {
      image: 'langa/underbuilt-server',
      expr: /^v([0-9.]+)$/,
      deployImage: 'underbuilt-server-staging/web'
    },
    {
      image: 'langa/underbuilt-server',
      expr: /^final$/,
      deployImage: 'underbuilt-server-prod/web'
    }
  ],
  engine: {
    host: 'docker-build.ec2.langa.io',
    port: 4550
  },
  registries: {
    source: {
      host: 'registry.hub.docker.com',
      auth: {
        username: process.env.DOCKER_SOURCE_AUTH_USERNAME,
        password: process.env.DOCKER_SOURCE_AUTH_PASSWORD,
        serveraddress: process.env.DOCKER_SOURCE_AUTH_SERVER
      }
    },
    target: {
      host: 'registry.heroku.com',
      auth: {
        username: process.env.DOCKER_TARGET_AUTH_USERNAME,
        password: process.env.DOCKER_TARGET_AUTH_PASSWORD,
        serveraddress: process.env.DOCKER_TARGET_AUTH_SERVER
      }
    }
  }
}
