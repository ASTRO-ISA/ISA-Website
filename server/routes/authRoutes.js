const express = require('express')
const authController = require('../controllers/authController')
const authenticateToken = require('../middlewares/authenticateToken')
const router = express.Router()
const rateLimit = require('express-rate-limit')

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many registration attempts. Try again later.'
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts. Try again later.'
})

const logoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many logout attempts. Try again later.'
})

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Too many forgot password requests. Try again later.'
})

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: 'Too many reset attempts. Try again later.'
})

const updatePasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Too many password updation attempts. Try again later.'
})

const verifyOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many OTP verification attempts. Try again later.'
})

const resendOtpLimiter = rateLimit({
  windowMs: 90 * 1000, // 1.5 minutes cooldown
  max: 1,
  message: 'You can request a new OTP only once per 1.5 minutes.'
})

router.route('/signup').post(registerLimiter, authController.signup)
router.route('/login').post(loginLimiter, authController.login)
router.route('/logout').get(logoutLimiter, authController.logout)
router
  .route('/forgot-password')
  .post(forgotPasswordLimiter, authController.forgotPassword)
router
  .route('/resetPassword')
  .post(resetPasswordLimiter, authController.resetPassword)

router.route('/verify-otp').post(verifyOtpLimiter, authController.verifyOtp)

router.route('/resend-otp').post(resendOtpLimiter, authController.resendOtp)

router.use(authenticateToken)
router
  .route('/updatePassword')
  .patch(updatePasswordLimiter, authController.updatePassword)

module.exports = router
