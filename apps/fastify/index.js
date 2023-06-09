"use strict";

const apm = require('elastic-apm-node')
apm.start({ captureBody: 'transactions' })

const { randomUUID } = require('crypto');

const winston = require('winston');
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  defaultMeta: {
    'service.name': 'app-fastify'
  }
})

const { default: axios } = require('axios');
const fastify = require('fastify')


// Require the framework and instantiate it
const app = fastify({
  logger: false
})

// Declare a route
app.get('/', async (request, reply) => {
  await axios.get('http://app-express.dev.svc:3000/', { headers: { customLabel: randomUUID() } })
  logger.info(`random message from ${request.ip}`)
  reply.send({ hello: 'world' })
})

// Run the server!
const start = async () => {
  try {
    await app.listen({ host: '0.0.0.0', port: 3000 })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
