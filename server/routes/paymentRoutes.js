const express = require('express')
const router = express.Router()
const {
    initiatePayment,
    verifyPayment,
    requestRefund,
    approveRefund
} = require('../controllers/paymentController')
const authenticateToken = require('../middlewares/authenticateToken')
const rateLimit = require('express-rate-limit')
const restrictTo = require('../middlewares/restrictTo')

const paymentLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many payment requests. Try again later.'
});

const refundRequestLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 2,
  message: 'Too many payment requests. Try again later.'
});

// router.route('/').get(initiatePayment)
router.use(authenticateToken)
router.route('/payment/initiate/:itemId').post(paymentLimiter, initiatePayment)
router.route('/status/:transactionId').get(verifyPayment)
router.route('/request-refund/:transactionId').post(refundRequestLimiter, requestRefund)

router.use(restrictTo(['admin', 'super-admin']))
router.route('/approve-refund/:transactionId/:refundId').post(approveRefund)

module.exports = router