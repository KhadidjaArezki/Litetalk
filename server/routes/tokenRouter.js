const { Router } = require('express')

const {
  getTokenController,
  deleteTokenController,
} = require('../Controller/tokenController')

const router = Router()

router.get('/', getTokenController)
router.delete('/:id', deleteTokenController)

module.exports = router
