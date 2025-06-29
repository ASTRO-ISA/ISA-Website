const express = require('express')
const router = express.Router()
const multer = require('multer')
const galleryController = require('../controllers/galleryController')
const restrictTo = require('../middlewares/restrictTo')
const authenticateToken = require('../middlewares/authenticateToken')
const { imageStorage } = require('../utils/cloudinaryStorage')

const uploadPic = multer({ storage: imageStorage('gallery-pics')})

router.use(authenticateToken)
router.use(restrictTo('admin'))
router.get('/', galleryController.allPics)
router.post('/', uploadPic.single('image'), galleryController.uploadPics)
router.delete('/:id', galleryController.deletePics)

module.exports = router