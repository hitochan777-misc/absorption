import express from 'express'
import session from 'express-session'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'
import api from './api'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import { Mockgoose } from 'mockgoose'
import config from '../nuxt.config.js'
import apolloServer from './graphql'
import { boards, cards, lists } from '../__mock__/data'

import Board from './models/board'
import Card from './models/card'
import List from './models/list'

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.set('port', port)
app.use(
  session({
    secret: 'super-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
  })
)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api', api)
apolloServer.applyMiddleware({ app })

// Import and Set Nuxt.js options
config.dev = !(process.env.NODE_ENV === 'production')

async function init_db(isDev = true) {
  if (isDev) {
    const mockgoose = new Mockgoose(mongoose)
    const proxy = process.env.http_proxy
    if (proxy) {
      mockgoose.helper.setProxy(proxy)
    }
    await mockgoose.prepareStorage()
  }
  await mongoose.connect('mongodb://foobar/baz')
  if (isDev) {
    await Board.create(boards)
    await Card.create(cards)
    await List.create(lists)
  }
}

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  init_db(config.dev)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
