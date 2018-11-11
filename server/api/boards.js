import { Router } from 'express'

import Card from '../models/card'
import List from '../models/list'
import Board from '../models/board'

const router = Router()

/* GET boards listing. */
router.get('/boards', function(req, res, next) {
  Board.find()
    .exec()
    .then(boards => {
      return res.json(boards)
    })
})

/* POST board.  */
router.post('/boards', function(req, res, next) {
  Board.create(req.body).then(() => {
    return res.sendStatus(200)
  })
})

/* PUT board.  */
router.put('/boards/:id', function(req, res, next) {
  Board.where({ id: req.params.id })
    .update(req.body)
    .exec()
    .then(() => {
      return res.sendStatus(200)
    })
})

/* DELETE board.  */
router.delete('/boards/:id', function(req, res, next) {
  const boardId = req.params.id

  Card.deleteMany({ boardId })
    .then(() => {
      return List.deleteMany({ boardId })
    })
    .then(() => {
      return Board.deleteOne({ id: boardId })
    })
    .then(() => {
      return res.sendStatus(200)
    })
})
export default router
