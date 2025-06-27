const express = require('express')
const path = require('path')
const eventController = require('../controllers/eventController')
const authenticateToken = require('../middlewares/authenticateToken')
const multer = require('multer')
const router = express.Router()
const { imageStorage } = require('../utils/cloudinaryStorage')

const uploadImage = multer({ storage: imageStorage('event-banners')})

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

router.use(restrictTo('admin'))
router.put('/:id', authenticateToken,eventController.updateEvent);
router.delete('/:id', authenticateToken, eventController.deleteEvent);

module.exports = router
