const { StandardCheckoutClient, Env, StandardCheckoutPayRequest, RefundRequest } = require('pg-sdk-node')
const User = require('../models/userModel')
const Webinar = require('../models/webinarModel')
const Event = require('../models/eventModel')
const PaymentTransaction = require('../models/transactionsModel')
const Course = require('../models/coursesModel')
const Joi = require('joi')

// phonepe client
const clientId = process.env.PP_CLIENT_ID
const clientSecret = process.env.PP_CLIENT_SECRET
const clientVersion = process.env.PP_CLIENT_VERSION
const phonepeEnv = process.env.NODE_ENV === 'production' ? Env.PRODUCTION : Env.SANDBOX
const phonepeClient = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, phonepeEnv)

// validation schema - to verify the amount
const paymentSchema = Joi.object({
  amount: Joi.number().positive().required()
})

// initiate payment (idempotent, Option B: always new transaction)
exports.initiatePayment = async (req, res) => {
  try {
    const { amount, item_type } = req.body
    const itemId = req.params.itemId
    const user_id = req.user.id

    // validate amount input
    const { error } = paymentSchema.validate({ amount })
    if (error) return res.status(400).json({ error: error.details[0].message })

    // retrieve the actual item to verify amount
    let realAmount
    if (item_type === 'webinar') {
      const webinar = await Webinar.findById(itemId)
      if (!webinar) return res.status(404).json({ error: 'Webinar not found' })
      realAmount = webinar.fee
    } else if (item_type === 'event') {
      const event = await Event.findById(itemId)
      if (!event) return res.status(404).json({ error: 'Event not found' })
      realAmount = event.fee
    } else if (item_type === 'course') {
      const course = await Course.findById(itemId)
      if (!course) return res.status(404).json({ error: 'Course not found' })
      realAmount = course.fee
    } else {
      return res.status(400).json({ error: 'Invalid item type' })
    }

    // check expected amount
    if (realAmount !== amount) {
      return res.status(422).json({ message: 'Transaction amount does not match the expected price.' })
    }

    // check user existence
    const user = await User.findById(user_id)
    if (!user) return res.status(403).json({ error: 'Unauthorized user' })

    // mark any existing pending transaction as abandoned
    // await PaymentTransaction.updateMany(
    //   { user_id, amount, status: 'pending' },
    //   { status: 'abandoned', lastCheckedAt: new Date() }
    // )

    // create a unique merchant order id for phonepe
    const transactionId = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`

    // frontend will redirect to this url after gateway payment page
    const redirectUrl = `${process.env.ORIGIN_FRONTEND}/payment-status?orderId=${transactionId}&itemType=${item_type}&itemId=${itemId}`

    // save new transaction log in our database
    const newTx = await PaymentTransaction.create({
      user_id,
      item: { item_type: item_type, item_id: itemId },
      orderId: transactionId,
      amount,
      currency: 'INR',
      status: 'created', // initially created
    })

    // link transaction to user
    await User.findByIdAndUpdate(user_id, { $push: { transactions: newTx._id } })

    // build phonepe payment request
    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(transactionId)
      .amount(amount * 100) // amount in paise
      .redirectUrl(redirectUrl)
      .build()

    const response = await phonepeClient.pay(request)

    // update status to pending after successful request
    await PaymentTransaction.findByIdAndUpdate(newTx._id, { status: 'pending' })

    // respond with transaction id and redirect url
    res.json({ transactionId, redirect_url: response.redirectUrl })
  } catch (err) {
    console.error('Payment Initiation Error:', {
      user_id: req.user?.id,
      message: err.message
    })
    res.status(500).json({ error: 'Payment initiation failed' })
  }
}

// verify payment status (idempotent, update our records)
exports.verifyPayment = async (req, res) => {
  try {
    const { transactionId, itemType } = req.params

    // query phonepe for order status
    const statusResponse = await phonepeClient.getOrderStatus(transactionId)
    const state = statusResponse.state
    let newStatus = 'failed'
    if (state === 'COMPLETED') {
      newStatus = 'success'
    } else if (state === 'PENDING') {
      newStatus = 'pending'
    }

    // fetch transaction
    const tx = await PaymentTransaction.findOne({ orderId: transactionId })
    if (!tx) return res.status(404).json({ error: 'Transaction not found' })

    // update transaction
    tx.status = newStatus
    tx.gatewayTransactionId = statusResponse.paymentDetails?.[0]?.transactionId
    tx.method = statusResponse.paymentDetails?.[0]?.paymentMode || 'unknown'
    tx.lastCheckedAt = new Date()
    tx.rawGatewayResponse = statusResponse
    tx.attempts = newStatus === 'success' ? 0 : tx.attempts + 1
    await tx.save()

    res.json({ transactionId, data: statusResponse, itemType })
  } catch (err) {
    console.error('Payment Verification Error:', {
      transactionId: req.params.transactionId,
      message: err.message
    })
    res.status(500).json({ error: 'Payment verification failed' })
  }
}

// request a refund (user-initiated; admin approval required)
exports.requestRefund = async (req, res) => {
  try {
    const { transactionId } = req.params
    const { amount } = req.body
    const userId = req.user.id

    // find the transaction and verify it's successful
    const tx = await PaymentTransaction.findOne({ orderId: transactionId })
    if (!tx) return res.status(404).json({ error: 'Transaction not found' })
    if (tx.status !== 'success') {
      return res.status(400).json({ error: 'Only successful transactions can be refunded' })
    }

    // compute total already refunded
    const refundedAmount = tx.refunds?.reduce((sum, r) => r.status === 'success' ? sum + r.amount : sum, 0) || 0
    if (refundedAmount + amount > tx.amount) {
      return res.status(400).json({ error: 'Refund amount exceeds original payment' })
    }

    // create a pending refund entry
    const refundId = `REF_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    tx.refunds = tx.refunds || []
    tx.refunds.push({ refundId, amount, status: 'pending_approval' })
    await tx.save()

    res.json({ message: 'Refund request submitted for admin approval', refundId })
  } catch (err) {
    console.error('Refund Request Error:', err.message)
    res.status(500).json({ error: 'Refund request failed' })
  }
}

// approve or reject a refund (admin only)
exports.approveRefund = async (req, res) => {
  try {
    const { transactionId, refundId } = req.params
    const adminId = req.user.id
    const { approve } = req.body // true to approve, false to reject

    if (typeof(approve) !== 'boolean') {
      return res.status(400).json({ message: 'Request could not be processed' });
    }

    const sender = await User.findOne({ _id: adminId }).select('role')
    if (sender.role !== 'admin' && sender.role !== 'super-admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const tx = await PaymentTransaction.findOne({ orderId: transactionId })
    if (!tx) return res.status(404).json({ error: 'Transaction not found' })

    const refund = tx.refunds.find(r => r.refundId === refundId)
    if (!refund) return res.status(404).json({ error: 'Refund not found' })
    if (refund.status !== 'pending_approval') {
      return res.status(400).json({ error: 'Refund is not pending approval' })
    }

    // check payment status with PhonePe before refund
    const statusResponse = await phonepeClient.getOrderStatus(transactionId)
    if (statusResponse.state !== 'COMPLETED') {
      return res.status(400).json({ message: 'Transaction not in a refundable state' })
    }

    if (!approve) {
      refund.status = 'rejected'
      refund.approvedBy = adminId
      await tx.save()
      return res.json({ message: 'Refund rejected' })
    }

    // initiate refund via phonepe sdk
    const request = RefundRequest.builder()
      .amount(refund.amount * 100)             // amount in paise
      .merchantRefundId(refundId)
      .originalMerchantOrderId(transactionId)
      .build()
    const response = await phonepeClient.refund(request)

    refund.status = response.state === 'COMPLETED' ? 'success' : 'failed'
    refund.rawGatewayResponse = response
    refund.approvedBy = adminId
    await tx.save()

    res.json({ message: 'Refund processed', refundId, data: response })
  } catch (err) {
    console.error('Refund Approval Error:', err.message)
    res.status(500).json({ error: 'Refund approval failed' })
  }
}

exports.getTransactions = async (req, res) => {
  try{
    const txs = await PaymentTransaction.find({})
    if(!txs) return res.status(404).json('Transactions not found')
    
    res.json({transactions: txs})
  } catch {
    console.error('Error finding the transactions.', err.message)
    res.status(500).json({error: 'Internal server error finding the transactions'})
  }
}