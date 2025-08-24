const express = require('express')
const router = express.Router()
const extApiController = require('../controllers/extApiController')

router.get('/', extApiController.upcomingLaunches)
router.get('/potd', extApiController.pictureOfTheDay)
router.get('/external', extApiController.externalBlogs)
router.get('/articles', extApiController.newsArticles)
router.get('/astro-calender', extApiController.astronomyCalender)

module.exports = router
