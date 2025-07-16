const express = require('express')
const authController = require('../controllers/authController')
const authenticateToken = require('../middlewares/authenticateToken')
const multer = require('multer')
const { imageStorage } = require('../utils/cloudinaryStorage')
const router = express.Router()

const uploadImage = multer({ storage: imageStorage('user-image') })

router.route('/signup').post(authController.signup)
router.route('/login').post(authController.login)
router.route('/logout').get(authController.logout)
router.route('/forgotPassword').post(authController.forgotPassword)
router.route('/resetPassword').post(authController.resetPassword)

router.use(authenticateToken)

router.route('/updatePassword').patch(authController.updatePassword)
router
  .route('/updateUser/:id')
  .patch(uploadImage.single('avatar'), authController.updateUser)

// protected route to check if the user is logged in
router.route('/me').get(authController.getMe)

module.exports = router
