const express = require('express')
const path = require('path')
const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the ISA Website API!'
  })
})

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  })
  next()
})

module.exports = app
