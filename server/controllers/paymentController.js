const axios = require('axios')
const crypto = require('crypto')
const User = require('../models/userModel')
const PaymentTransaction = require('../models/transactionsModel')
const Joi = require('joi')

// validation schema - to validate the incoming data
const paymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  mobileNumber: Joi.string().pattern(/^[6-9]\d{9}$/).required()
})

// initiate payment (idempotent + secure)
exports.initiatePayment = async (req, res) => {
  try {
    const { amount, mobileNumber } = req.body
    const userId = req.user.id

    // validate inputs
    const { error } = paymentSchema.validate({ amount, mobileNumber })
    if (error) return res.status(400).json({ error: error.details[0].message })

    const user = await User.findById(userId)
    // if (!user || !user.active) return res.status(403).json({ error: 'Unauthorized user' }) // we are not assigning active status when creating user
    if (!user) return res.status(403).json({ error: 'Unauthorized user' })

    // generate unique transaction ID and callback
    const transactionId = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    const callbackUrl = `${process.env.CLIENT_URL}/api/payments/callback`
    const nonce = crypto.randomBytes(8).toString('hex')

    // check idempotency
    const existingTx = await PaymentTransaction.findOne({
      userId,
      amount,
      status: 'pending'
    })
    if (existingTx) return res.json({ message: 'Pending transaction exists', transactionId: existingTx.orderId })

    // construct payload
    const payload = {
      merchantId: process.env.PP_MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: userId,
      amount: amount * 100,
      redirectUrl: callbackUrl,
      redirectMode: 'POST',
      callbackUrl,
      mobileNumber,
      nonce,
      paymentInstrument: { type: 'PAY_PAGE' }
    }

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64')
    const checksum = crypto
      .createHash('sha256')
      .update(base64Payload + '/pg/v1/pay' + process.env.PP_SALT_KEY)
      .digest('hex') + '###' + process.env.PP_SALT_INDEX

    // save transaction
    const newTx = await PaymentTransaction.create({
      userId,
      orderId: transactionId,
      amount,
      status: 'pending',
      currency: 'INR'
    })

    // link transaction to user
    await User.findByIdAndUpdate(userId, { $push: { transactions: newTx._id } })

    // hit PhonePe API
    const response = await axios.post(
      `${process.env.PP_HOST_URL}/pg/v1/pay`,
      { request: base64Payload },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': process.env.PP_MERCHANT_ID
        }
      }
    )

    res.json({ transactionId, data: response.data })
  } catch (err) {
    console.error('Payment Initiation Error:', {
      userId: req.user?.id,
      message: err.message
    })
    res.status(500).json({ error: 'Payment initiation failed' })
  }
}

// verify payment (idempotent and reconciliation)
exports.verifyPayment = async (req, res) => {
  try {
    const { transactionId } = req.params

    // construct PhonePe status URL
    const url = `/pg/v1/status/${process.env.PP_MERCHANT_ID}/${transactionId}`
    const checksum = crypto
      .createHash('sha256')
      .update(url + process.env.PP_SALT_KEY)
      .digest('hex') + '###' + process.env.PP_SALT_INDEX

    // hit PhonePe status API
    const response = await axios.get(`${process.env.PP_HOST_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': process.env.PP_MERCHANT_ID
      }
    })

    const paymentData = response.data
    // const newStatus = paymentData.success ? 'success' : 'failed'
    let newStatus = 'failed'
    if (paymentData.code === 'PAYMENT_SUCCESS') {
      newStatus = 'success'
    } else if (paymentData.code === 'PAYMENT_PENDING') {
      newStatus = 'pending'
    }

    // idempotent update
    const tx = await PaymentTransaction.findOneAndUpdate(
      { orderId: transactionId, status: 'pending' },
      {
        $set: {
          status: newStatus,
          gatewayTransactionId: paymentData.data?.transactionId,
          method: paymentData.data?.paymentInstrument?.type || 'unknown',
          lastCheckedAt: new Date(),
          rawGatewayResponse: {
            status: paymentData.success,
            transactionId: paymentData.data?.transactionId,
            method: paymentData.data?.paymentInstrument?.type
          },
          attempts: (paymentData.success ? 0 : 1)
        }
      },
      { new: true }
    )

    res.json({ transactionId, data: paymentData })
  } catch (err) {
    console.error('Payment Verification Error:', {
      transactionId: req.params.transactionId,
      message: err.message
    })
    res.status(500).json({ error: 'Payment verification failed' })
  }
}

// request refund
exports.requestRefund = async (req, res) => {
  try {
    const { transactionId } = req.params
    const { amount, reason } = req.body
    const userId = req.user.id

    const tx = await PaymentTransaction.findOne({ orderId: transactionId, userId })
    if (!tx) return res.status(404).json({ error: 'Transaction not found' })
    if (tx.status !== 'success') return res.status(400).json({ error: 'Only successful transactions can be refunded' })

    const refundedAmount = tx.refunds?.reduce((sum, r) => r.status === 'success' ? sum + r.amount : sum, 0) || 0
    if (refundedAmount + amount > tx.amount) {
      return res.status(400).json({ error: 'Refund amount exceeds original payment' })
    }

    const refundId = `REF_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    tx.refunds.push({ refundId, amount, reason, status: 'pending_approval' })
    await tx.save()

    res.json({ message: 'Refund request submitted for admin approval', refundId })
  } catch (err) {
    console.error('Refund Request Error:', err.message)
    res.status(500).json({ error: 'Refund request failed' })
  }
}

// approve refund
exports.approveRefund = async (req, res) => {
  try {
    const { transactionId, refundId } = req.params
    const adminId = req.user.id // admin only
    const { approve } = req.body // true = approve, false = reject

    const tx = await PaymentTransaction.findOne({ orderId: transactionId })
    if (!tx) return res.status(404).json({ error: 'Transaction not found' })

    const refund = tx.refunds.find(r => r.refundId === refundId)
    if (!refund) return res.status(404).json({ error: 'Refund not found' })
    if (refund.status !== 'pending_approval') {
      return res.status(400).json({ error: 'Refund is not pending approval' })
    }

    if (!approve) {
      refund.status = 'rejected'
      refund.approvedBy = adminId
      await tx.save()
      return res.json({ message: 'Refund rejected' })
    }

    // proceed with PhonePe API call
    const payload = {
      merchantId: process.env.PP_MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantRefundId: refundId,
      amount: refund.amount * 100,
      callbackUrl: `${process.env.CLIENT_URL}/api/payments/refund/callback`
    }

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64')
    const checksum = crypto
      .createHash('sha256')
      .update(base64Payload + '/pg/v1/refund' + process.env.PP_SALT_KEY)
      .digest('hex') + '###' + process.env.PP_SALT_INDEX

    const response = await axios.post(
      `${process.env.PP_HOST_URL}/pg/v1/refund`,
      { request: base64Payload },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': process.env.PP_MERCHANT_ID
        }
      }
    )

    refund.status = response.data.success ? 'success' : 'failed'
    refund.rawGatewayResponse = response.data
    refund.approvedBy = adminId
    await tx.save()

    res.json({ message: 'Refund processed', refundId, data: response.data })
  } catch (err) {
    console.error('Refund Approval Error:', err.message)
    res.status(500).json({ error: 'Refund approval failed' })
  }
}