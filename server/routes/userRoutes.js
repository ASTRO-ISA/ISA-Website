const express = require('express')
const authController = require('../controllers/authController')
const authenticateToken = require('../middlewares/authenticateToken')

const router = express.Router()

router.route('/signup').post(authController.signup)
router.route('/login').post(authController.login)
router.route('/logout').get(authController.logout)

// protected route to check if the user is logged in
router.route('/me').get(authenticateToken, authController.getMe)

module.exports = router
