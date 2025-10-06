const mongoose = require('mongoose')

const refundSchema = new mongoose.Schema({
  refundId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending_approval', 'initiated', 'success', 'failed', 'rejected'], 
    default: 'pending_approval' 
  },
  reason: String,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin user
  rawGatewayResponse: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
})

const PaymentTransactionSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  // item: {
  //   item_type: {
  //     type: String,
  //     required: true,
  //     enum: ['event', 'webinar', 'course']
  //   },
  //   item_id: {
  //     type: String,
  //     required: true,
  //   }
  // },
  orderId: { 
    type: String, 
    unique: true, 
    required: true,
    minlength: 6,
    maxlength: 150,
    match: /^TXN_\d+_\d+$/, // enforce TXN_xxx_xxx format
  },
  gatewayTransactionId: { 
    type: String,
    sparse: true, // may not exist initially
    maxlength: 100
  }, 
  amount: { 
    type: Number, 
    required: true,
    min: [1, "Amount must be at least 1 paise"],
  },
  currency: { 
    type: String, 
    default: 'INR',
    enum: ['INR'], // PhonePe only support INR
  },
  status: { 
    type: String, 
    enum: ['created', 'pending', 'success', 'failed', 'refunded'], 
    default: 'created' 
  },
  method: { 
    type: String,
    enum: ['UPI', 'CARD', 'WALLET', 'NET_BANKING', 'unknown'],
    default: 'unknown'
  },
  attempts: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5 // to prevent infinite reconciliation retries
  },
  lastCheckedAt: { 
    type: Date,
    default: null
  },
  rawGatewayResponse: { 
    type: Object,
    default: {}
  },
  refunds: [refundSchema]
}, { timestamps: true })

const PaymentTransaction = mongoose.model('PaymentTransaction', PaymentTransactionSchema)

module.exports = PaymentTransaction