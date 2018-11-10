import express from 'express'
import { Nuxt, Builder } from 'nuxt'
import session from 'express-session'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import { Mockgoose } from 'mockgoose'
import { execute, subscribe } from 'graphql'
import { createServer } from 'http'
import { SubscriptionServer } from 'subscriptions-transport-ws'

import api from './api'
import config from '../nuxt.config.js'
import apolloServer from './graphql'
import { boards, cards, lists} from '../__mock__/data'

import Board from './models/board'
import Card from './models/card'
import List from './models/list'

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.set('port', port)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}))

// Import API Routes
app.use('/api', api)

// Import and Set Nuxt.js options
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)

const mockgoose = new Mockgoose(mongoose)
const proxy = process.env.http_proxy
if (proxy) {
  mockgoose.helper.setProxy(proxy)
}

apolloServer.applyMiddleware({app})


mockgoose.prepareStorage()
  .then(() => {
    mongoose.connect('mongodb://foobar/baz')
    mongoose.connection.on('connected', () => {
      Board.create(boards)
        .then(Card.create(cards))
        .then(List.create(lists))
        .then(() => {
          // const ws = createServer(app)
          // ws.listen(port, host, () => {
          //   return new SubscriptionServer({
          //     execute,
          //     subscribe,
          //     schema
          //   }, {
          //     server: ws,
          //     path: '/api/subscriptions'
          //   })
          // })
          app.listen({port}, () => {console.log("listening")})
        })
    })
  })
