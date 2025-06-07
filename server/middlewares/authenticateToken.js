const jwt = require('jsonwebtoken')
require('dotenv').config()
// const cookieParser = require('cookie-parser')

function authenticateToken(req, res, next) {
  const token = req.cookies.jwt // extract token from cookie

  if (!token) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(401)
    req.user = user
    next()
  })
}

module.exports = authenticateToken
