const express = require('express')
const path = require('path')
const eventController = require('../controllers/eventController')
const authenticateToken = require('../middlewares/authenticateToken')
const multer = require('multer')
const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
})

const upload = multer({ storage })

router.route('/').get(eventController.Events)
router
  .route('/create')
  .post(
    authenticateToken,
    upload.single('thumbnail'),
    eventController.createEvent
  )
router.route('/:id').get(eventController.getEvent)
router.route('/register/:eventid/:userid').patch(eventController.registerEvent)

module.exports = router
