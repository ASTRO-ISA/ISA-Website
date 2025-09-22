const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otpHash: { type: String, required: true }, // store hashed OTP, not plain
  expiresAt: { type: Date, required: true, index: { expires: 300 } } // auto-delete after 5 min
})

const Otp = mongoose.model('Otp', otpSchema)
module.exports = Otp
