import express from 'express'
import { Nuxt, Builder } from 'nuxt'
import session from 'express-session'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import {Mockgoose} from 'mockgoose'

import api from './api'

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
let config = require('../nuxt.config.js')
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

mockgoose.prepareStorage()
  .then(() => {
    mongoose.connect('mongodb://foobar/baz')
    mongoose.connection.on('connected', () => {
      // Listen the server
      app.listen(port, host)
      console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
    })
  })
