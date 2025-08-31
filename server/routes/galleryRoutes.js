const express = require('express')
const router = express.Router()
const multer = require('multer')
const galleryController = require('../controllers/galleryController')
const restrictTo = require('../middlewares/restrictTo')
const authenticateToken = require('../middlewares/authenticateToken')
const { imageStorage } = require('../utils/cloudinaryStorage')

const uploadPic = multer({ storage: imageStorage('gallery-pics') })
const uploadFeatured = multer({
  storage: imageStorage('featured-club-astronomy-image')
})

router.get('/', galleryController.allPics)
router.get('/featured', galleryController.getFeatured)

router.use(authenticateToken)
router.use(restrictTo(['admin', 'super-admin']))
router.post('/', uploadPic.single('image'), galleryController.uploadPics)
router.post(
  '/featured',
  uploadFeatured.single('image'),
  galleryController.uploadFeatured
)
router.delete('/featured/:id', galleryController.deleteFeatured)
router.delete('/:id', galleryController.deletePics)

module.exports = router
