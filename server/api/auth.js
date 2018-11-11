import { Router } from 'express'
import crypto from 'crypto'

const router = Router()

const secretKey = 'secretKey'
const hash = password => {
  return crypto
    .createHmac('sha256', secretKey)
    .update(password)
    .digest('hex')
}
const accounts = {
  demo: hash('demo')
}

router.post('/login', function(req, res) {
  const username = req.body.username
  const password = req.body.password

  if (accounts[username] && accounts[username] === hash(password)) {
    req.session.authUser = { username }
    return res.json({ username })
  }
  res.status(401).json({ error: 'Bad credentials' })
})

router.post('/logout', function(req, res) {
  delete req.session.authUser
  res.json({ ok: true })
})

router.post('/signup', function(req, res) {
  accounts[req.body.username] = hash(req.body.password)
  res.sendStatus(200)
})

export default router
