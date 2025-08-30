const express = require('express')
const router = express.Router()
const multer = require('multer')
const { imageStorage } = require('../utils/cloudinaryStorage')
const restrictTo = require('../middlewares/restrictTo')
const authenticateToken = require('../middlewares/authenticateToken')
const {
  getAllPics,
  uploadPic,
  deletePic,
  setFeaturedFromUserPic
} = require('../controllers/userPicForPotdController')
const rateLimit = require('express-rate-limit')

const uploadImage = multer({ storage: imageStorage('user-pics-for-potd') })

const uploadLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: 2,
  message: 'You can only send max 2 pics a day.'
})

router.use(authenticateToken)
router
  .route('/upload')
  .post(uploadLimit, uploadImage.single('image'), uploadPic)

router.use(restrictTo(['admin', 'super-admin']))
router.route('/').get(getAllPics)
router.route('/setFeatured').post(setFeaturedFromUserPic)
router.route('/delete/:id').delete(deletePic)

module.exports = router
