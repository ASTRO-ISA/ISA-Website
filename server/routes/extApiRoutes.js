const express = require('express')
const router = express.Router()
const extApiController = require('../controllers/extApiController')

router.get('/', extApiController.upcomingLaunches)

module.exports = router