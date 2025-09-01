const express = require('express')
const authController = require('../controllers/authController')
const authenticateToken = require('../middlewares/authenticateToken')
const multer = require('multer')
const { imageStorage } = require('../utils/cloudinaryStorage')
const router = express.Router()
const rateLimit = require('express-rate-limit')

const uploadImage = multer({ storage: imageStorage('user-image') })

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many registration attempts. Try again later.',
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts. Try again later.',
})

const logoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many logout attempts. Try again later.',
})

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Too many forgot password requests. Try again later.',
})

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: 'Too many reset attempts. Try again later.',
})

const updatePasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Too many password updation attempts. Try again later.',
})

const updateUserLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: 1,
  message: 'To many update requests. Try again later.'
})

router.route('/signup').post(registerLimiter, authController.signup)
router.route('/login').post(loginLimiter, authController.login)
router.route('/logout').get(logoutLimiter, authController.logout)
router.route('/forgot-password').post(forgotPasswordLimiter, authController.forgotPassword)
router.route('/resetPassword').post(resetPasswordLimiter, authController.resetPassword)

router.use(authenticateToken)

router.route('/updatePassword').patch(updatePasswordLimiter, authController.updatePassword)
router
  .route('/updateUser/:id')
  .patch(updateUserLimiter, uploadImage.single('avatar'), authController.updateUser)

// protected route to check if the user is logged in
router.route('/me').get(authController.getMe)
router.route('/saved-blogs').get(authController.getSavedBlogs)
router.route('/save-blog/:blogid').patch(authController.saveBlog)
router.route('/unsave-blog/:blogid').delete(authController.unSaveBlog)

module.exports = router
