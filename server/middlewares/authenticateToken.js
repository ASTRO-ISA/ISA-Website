const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
require('dotenv').config()

const setUser = async (req, user) => {
  try {
    const userDoc = await User.findById(user.id)
    if (!userDoc) return null
    req.user = userDoc
    return true
  } catch (error) {
    console.error('Error setting user:', error)
    return false
  }
}

function authenticateToken(req, res, next) {
  const token = req.cookies.jwt

  if (!token) return res.status(401).json({ message: 'No token provided' })

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' })

    const success = await setUser(req, decoded)
    if (!success) return res.status(401).json({ message: 'User not found' })

    next()
  })
}

module.exports = authenticateToken
