const express = require('express')
const router = express.Router()
const setFeaturedController = require('../controllers/setFeaturedController')
const restrictTo = require('../middlewares/restrictTo')
const authenticateToken = require('../middlewares/authenticateToken')

router.use(authenticateToken)
router.use(restrictTo(['admin', 'super-admin']))
router.patch('/:id', setFeaturedController.setFeaturedBlog)
router.patch('/remove/:id', setFeaturedController.removeFeaturedBlog)

module.exports = router