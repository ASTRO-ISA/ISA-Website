const cron = require('node-cron')
const { reconcilePendingTransactions } = require('../paymentReconciliation')

// every 10 min
cron.schedule('*/10 * * * *', async () => {
  await reconcilePendingTransactions()
})