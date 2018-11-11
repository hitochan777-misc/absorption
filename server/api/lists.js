import { Router } from 'express'

import Card from '../models/card'
import List from '../models/list'

const router = Router()

/* GET lists listing. */
router.get('/lists', function(req, res, next) {
  const query = {}
  if (req.query.boardId) {
    query.boardId = req.query.boardId
  }
  List.find(query)
    .exec()
    .then(lists => {
      return res.json(lists)
    })
})

/* POST list.  */
router.post('/lists', function(req, res, next) {
  List.create(req.body).then(() => {
    return res.sendStatus(200)
  })
})

/* PUT list.  */
router.put('/lists/:id', function(req, res, next) {
  List.where({ id: req.params.id })
    .update(req.body)
    .exec()
    .then(() => {
      return res.sendStatus(200)
    })
})

/* DELETE list.  */
router.delete('/lists/:id', function(req, res, next) {
  const listId = req.params.id

  Card.deleteMany({ listId })
    .then(() => {
      return List.deleteOne({ id: listId })
    })
    .then(() => {
      return res.sendStatus(200)
    })
})
export default router
