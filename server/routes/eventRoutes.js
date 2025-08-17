const express = require('express')
const eventController = require('../controllers/eventController')
const authenticateToken = require('../middlewares/authenticateToken')
const multer = require('multer')
const router = express.Router()
const { imageStorage } = require('../utils/cloudinaryStorage')
const restrictTo = require('../middlewares/restrictTo')

const uploadImage = multer({ storage: imageStorage('event-banners') })

router.route('/').get(eventController.approvedEvents)
router.route('/pending').get(authenticateToken, restrictTo('admin'), eventController.pendingEvents)
router.route('/all').get(authenticateToken, restrictTo('admin'), eventController.Events)

router.route('/:id').get(eventController.getEvent)
router
  .route('/create')
  .post(
    authenticateToken,
    uploadImage.single('thumbnail'),
    eventController.createEvent
  )

router.route('/my-events/:userid').get(authenticateToken, eventController.registeredEvents)
router.route('/status/:id').patch(authenticateToken, restrictTo('admin'), eventController.changeStatus)
router.route('/register/:eventid/:userid').patch(eventController.registerEvent)
router.route('/unregister/:eventid/:userid').patch(eventController.unregisterEvent)

router.use(authenticateToken)
router.delete('/:id', eventController.deleteEvent)
router.route('/:id').put(restrictTo('admin'), eventController.updateEvent)

module.exports = router
