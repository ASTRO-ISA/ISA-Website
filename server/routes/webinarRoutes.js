const express = require('express')
const webinarController = require('../controllers/webinarController')
const authenticateToken = require('../middlewares/authenticateToken')
const multer = require('multer')
const router = express.Router()
const { imageStorage } = require('../utils/cloudinaryStorage')
const restrictTo = require('../middlewares/restrictTo')

const uploadImage = multer({ storage: imageStorage('webinar-thumbnails')})

// for all users
router.route('/').get(webinarController.Webinars)
router.route('/:id').get(webinarController.getWebinar)
router.route('/featured').get(webinarController.featuredWebinar)

// for logged in users
router.use(authenticateToken)
router.route('/register/:eventid/:userid').patch(webinarController.registerWebinar)

// for admin
router.use(restrictTo('admin'))
router.route('/create').post(uploadImage.single('thumbnail'), webinarController.createWebinar)
router.route('/:id').patch(webinarController.updatedWebinar)
router.route('/:id').delete(webinarController.deleteWebinar)

module.exports = router