const express = require('express')
const router = express.Router()
const setFeaturedController = require('../controllers/setFeaturedController')

router.patch('/:id', setFeaturedController.setFeaturedBlog)
router.patch('/remove/:id', setFeaturedController.removeFeaturedBlog)

module.exports = router