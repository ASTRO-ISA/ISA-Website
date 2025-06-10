const express = require('express')
const path = require('path')
const eventController = require('../controllers/eventController')
const authenticateToken = require('../middlewares/authenticateToken')
const multer = require('multer')
const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.post('/create', authenticateToken, upload.single('thumbnail'), eventController.createEvent)
router.get('/', eventController.Events)
router.get('/:id', eventController.getEvent)

module.exports = router