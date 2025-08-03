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

const uploadImage = multer({ storage: imageStorage('user-pics-for-potd')})

router.use(authenticateToken)
router.use(restrictTo('admin'))

router.route('/').get(getAllPics)
router.route('/upload').post(uploadImage.single('image'), uploadPic)
router.route('/setFeatured').post(setFeaturedFromUserPic)
router.route('/delete/:id').delete(deletePic)

module.exports = router