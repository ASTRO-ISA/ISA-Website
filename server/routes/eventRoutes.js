const express = require('express')
const eventController = require('../controllers/eventController')
const authenticateToken = require('../middlewares/authenticateToken')
const multer = require('multer')
const router = express.Router()
const { imageStorage } = require('../utils/cloudinaryStorage')
const restrictTo = require('../middlewares/restrictTo')

const uploadImage = multer({ storage: imageStorage('event-banners') })

router.route('/').get(eventController.Events)
router
  .route('/create')
  .post(
    authenticateToken,
    uploadImage.single('thumbnail'),
    eventController.createEvent
  )
router.route('/:id').get(eventController.getEvent)
router.route('/register/:eventid/:userid').patch(eventController.registerEvent)

router.use(authenticateToken)
router.delete('/:id', eventController.deleteEvent)
router.use(restrictTo('admin'))
router.put('/:id', eventController.updateEvent)

module.exports = router
