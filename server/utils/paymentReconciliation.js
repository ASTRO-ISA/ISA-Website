const PaymentTransaction = require('../models/transactionsModel')
const { verifyPayment } = require('../controllers/paymentController')

exports.reconcilePendingTransactions = async () => {
  try {
    const now = new Date()

    // transactions that are 'created' or 'pending' for more than 30 mins → expire them
    const expirationCutoff = new Date(now - 30 * 60 * 1000) // 30 mins

    const toExpireTxs = await PaymentTransaction.find({
      status: { $in: ['created', 'pending'] },
      lastCheckedAt: { $lt: expirationCutoff }
    })

    for (const tx of toExpireTxs) {
      tx.status = 'expired'
      tx.lastCheckedAt = now
      await tx.save()
      console.log(`Transaction expired: ${tx.orderId}`)
    }

    // transactions that are 'pending' but recent → verify with gateway
    const verifyCutoff = new Date(now - 5 * 60 * 1000) // 5 mins
    const pendingTxs = await PaymentTransaction.find({
      status: 'pending',
      lastCheckedAt: { $lt: verifyCutoff }
    })

    for (const tx of pendingTxs) {
      try {
        // call verifyPayment as a function
        await verifyPayment({ params: { transactionId: tx.orderId, itemType: tx.item.item_type } })
        console.log(`Transaction verified: ${tx.orderId}`)
      } catch (err) {
        console.error(`Reconciliation failed for ${tx.orderId}:`, err.message)
      }
    }
  } catch (err) {
    console.error('Reconciliation cron error:', err.message)
  }
}