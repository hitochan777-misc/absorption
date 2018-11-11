import { Router } from 'express'

import Card from '../models/card'
import pubsub from '../lib/pubsub'

const router = Router()

/* GET cards listing. */
router.get('/cards', function(req, res, next) {
  const query = {}
  if (req.query.boardId) {
    query.boardId = req.query.boardId
  }
  Card.find(query)
    .exec()
    .then(lists => {
      return res.json(lists)
    })
})

/* POST card.  */
router.post('/cards', function(req, res, next) {
  Card.create(req.body).then(() => {
    pubsub.publish('cardUpdated', { cardUpdated: req.body })
    return res.sendStatus(200)
  })
})

/* PUT card.  */
router.put('/cards/:id', function(req, res, next) {
  Card.where({ id: req.params.id })
    .update(req.body)
    .exec()
    .then(() => {
      return res.sendStatus(200)
    })
})

/* DELETE card.  */
router.delete('/cards/:id', function(req, res, next) {
  Card.deleteOne({ id: req.params.id }).then(() => {
    return res.sendStatus(200)
  })
})

/* like card.  */
router.post('/cards/:id/like', function(req, res, next) {
  Card.where({ id: req.params.id })
    .update({ $addToSet: { like: req.session.authUser.username } })
    .exec()
    .then(() => {
      return res.sendStatus(200)
    })
})

/* unlike card.  */
router.delete('/cards/:id/like', function(req, res, next) {
  Card.where({ id: req.params.id })
    .update({ $pullAll: { like: req.session.authUser.username } })
    .exec()
    .then(() => {
      return res.sendStatus(200)
    })
})

export default router
