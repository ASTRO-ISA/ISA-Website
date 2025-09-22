const crypto = require('crypto')
const bcrypt = require('bcrypt')
const Otp = require('../models/OtpModel')
const User = require('../models/userModel')

exports.sendOtp = async (email, sendEmailFn) => {
  const otp = crypto.randomInt(100000, 999999).toString()
  const otpHash = await bcrypt.hash(otp, 12)
  const expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes

  // Update existing OTP or create a new one (upsert)
  await Otp.findOneAndUpdate(
    { email },
    { otpHash, expiresAt, createdAt: new Date() },
    { upsert: true }
  )

  const html = `
    <p>Hello User,</p>
    <p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>
    <p>Best regards,<br>Team ISA</p>
  `

  await sendEmailFn(email, 'Your OTP Code', html)
}

exports.verifyOtp = async (email, otp) => {
  // Get the latest OTP record
  const record = await Otp.findOne({ email }).sort({ createdAt: -1 })
  if (!record) throw new Error('OTP not found')

  // Check expiry
  if (record.expiresAt < Date.now()) {
    throw new Error('OTP expired')
  }

  // Compare OTP
  const isMatch = await bcrypt.compare(otp, record.otpHash)
  if (!isMatch) throw new Error('Invalid OTP')

  // Mark user as verified
  const user = await User.findOneAndUpdate(
    { email },
    { $set: { isVerified: true } },
    { new: true }
  )

  // Delete OTP after success
  await Otp.deleteMany({ email })

  return user
}
