const PaymentTransaction = require('../models/transactionsModel')
const { verifyPayment } = require('../controllers/paymentController')

exports.reconcilePendingTransactions = async () => {
  try {
    // find transactions that are pending for more than 5 mins
    const cutoff = new Date(Date.now() - 5 * 60 * 1000)

    const pendingTxs = await PaymentTransaction.find({
      status: 'pending',
      lastCheckedAt: { $lt: cutoff }
    })

    for (const tx of pendingTxs) {
      try {
        await verifyPayment({ params: { transactionId: tx.orderId } })
      } catch (err) {
        console.error(`Reconciliation failed for ${tx.orderId}:`, err.message)
      }
    }
  } catch (err) {
    console.error('Reconciliation cron error:', err.message)
  }
}