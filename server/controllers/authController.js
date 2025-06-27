const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
// const crypto = require('crypto')

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  }
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

  res.cookie('jwt', token, cookieOptions)

  user.password = undefined

  return res.status(statusCode).json({
    message: 'Success',
    token,
    data: {
      user
    }
  })
}

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      phoneNo: req.body.phoneNo,
      role: req.body.role,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      country: req.body.country
    })

    createSendToken(newUser, 201, res)
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

    createSendToken(user, 200, res)
  } catch (error) {
    res.status(500).json({ status: 'Fail', message: error.message })
  }
}

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')

    res.status(200).json({ status: 'success', user })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
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
