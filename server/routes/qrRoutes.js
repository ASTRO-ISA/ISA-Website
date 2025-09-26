const express = require('express')
const { verifyQR, addScanner } = require('../controllers/qrController')
const authenticateToken = require('../middlewares/authenticateToken')
const router = express.Router()

router.use(authenticateToken)
router.route('/verify/:token').post(verifyQR)
router.route('/add-scanner/:eventSlug').post(addScanner)

module.exports = router