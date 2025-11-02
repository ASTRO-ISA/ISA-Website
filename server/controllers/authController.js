const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const { sendEmail } = require('../utils/sendEmail')
const generateAndSendToken = require('../utils/generateAndSendToken')
const otpService = require('../services/otpService')

exports.signup = async (req, res) => {
  try {
    const { name, email, phoneNo, password, confirmPassword } = req.body
    
    // check if email already registered
    const existingUser = await User.findOne({ email })
    if(existingUser) return res.status(409).json({ message: 'A user with this email or username already exists.' })

    const user = await User.create({
      name,
      email,
      phoneNo,
      password,
      confirmPassword
    })

    // await otpService.sendOtp(user.email, sendEmail)
    generateAndSendToken.createSendToken(user, 200, res)

    // res.status(200).json({
    //   message: 'Signup successful. Please verify your email with OTP.'
    // })
  } catch (error) {
    res.status(500).json({ status: 'Fail', message: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    //check both email and password are there
    if (!email || !password) {
      return res.status(400).json({
        status: 'Fail',
        message: 'Please provide both email and Password'
      })
    }
    const user = await User.findOne({ email }).select('+password')

    //   if user present then compare password
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res
        .status(401)
        .json({ status: 'Fail', message: 'Incorrect email or password' })
    }

    // 3) Check verification
    // if (!user.isVerified) {
    //   // Re-send OTP
    //   await otpService.sendOtp(user.email, sendEmail)
    //   return res.status(403).json({
    //     message: 'Please verify your email before logging in. OTP sent again.'
    //   })
    // }

    generateAndSendToken.createSendToken(user, 200, res)
  } catch (error) {
    res.status(500).json({ status: 'Fail', message: error.message })
  }
}

exports.logout = async (req, res) => {
  res.cookie('jwt', '', {
    // setting the cookie to empty
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0)
  })
  res.status(200).json({ status: 'success', message: 'Logged out' })
}

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // 1. Get user and include password field
    const user = await User.findById(req.user.id).select('+password')

    // 2. Check if current password is correct
    const isCorrect = await user.correctPassword(currentPassword, user.password)
    if (!isCorrect) {
      return res.status(401).json({
        status: 'fail',
        message: 'Current password is incorrect'
      })
    }

    // 3. Set new password and save
    user.password = newPassword
    await user.save() // Will trigger pre-save hash + passwordChangedAt

    // 4. Send new JWT
    generateAndSendToken.createSendToken(user, 200, res)
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })
  if (!user)
    return res.status(404).json({ message: 'User not found with this email' })

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '15m'
  })

  const resetLink = `${process.env.ORIGIN_FRONTEND}/reset-password/${token}`

  const html = `
  <p>Hello ${user.name || 'User'},</p>

  <p>We received a request to reset your password for your ISA account.</p>

  <p>You can reset your password by clicking the link below:</p>
  <p>
    <a href="${resetLink}" target="_blank">Reset your password</a>
  </p>

  <p>If you did not request a password reset, please ignore this email.  
  Your account will remain secure and no changes will be made.</p>

  <p>Best regards,<br>
  Team ISA</p>
`

  await sendEmail(user.email, 'Reset your password', html)

  res.status(200).json({ message: 'Reset link sent to email' })
}

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('+password')
    if (!user) return res.status(400).json({ message: 'Invalid user' })

    user.password = newPassword
    user.passwordChangedAt = Date.now()
    await user.save()

    res
      .status(200)
      .json({ status: 'success', message: 'Password has been reset' })
  } catch (err) {
    return res.status(400).json({
      message: 'Invalid or expired token',
      error: err.message
    })
  }
}

// otp
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await otpService.verifyOtp(email, otp)

    generateAndSendToken.createSendToken(user, 200, res)
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body

    // if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' })
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Email already verified' })
    }

    // Send new OTP
    await otpService.sendOtp(email, sendEmail)

    res.status(200).json({
      status: 'success',
      message: 'OTP resent successfully. Check your inbox.'
    })
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message })
  }
}
