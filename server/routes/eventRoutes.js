const express = require('express')
const eventController = require('../controllers/eventController')
const authenticateToken = require('../middlewares/authenticateToken')
const multer = require('multer')
const router = express.Router()
const { imageStorage } = require('../utils/cloudinaryStorage')
const restrictTo = require('../middlewares/restrictTo')

const uploadImage = multer({ storage: imageStorage('event-banners') })

router.route('/').get(eventController.approvedEvents)
router.use(authenticateToken)
router
  .route('/pending')
  .get(
    restrictTo(['admin', 'super-admin']),
    eventController.pendingEvents
  )
router
  .route('/all')
  .get(
    restrictTo(['admin', 'super-admin']),
    eventController.Events
  )

router.route('/:slug').get(eventController.getEvent)
router
  .route('/create')
  .post(
    uploadImage.single('thumbnail'),
    eventController.createEvent
  )

router
  .route('/my-events/:userid')
  .get(eventController.registeredEvents)
router
  .route('/status/:id')
  .patch(restrictTo(['admin', 'super-admin']), eventController.changeStatus)
router.route('/register/:eventid/:userid').patch(eventController.registerEvent)
router
  .route('/unregister/:eventid/:userid')
  .patch(eventController.unregisterEvent)

router.delete('/:id', eventController.deleteEvent)
router
  .route('/:id')
  .put(restrictTo(['admin', 'super-admin']), eventController.updateEvent)

module.exports = router
