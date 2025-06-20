const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

// routes
const blogRouter = require('./routes/blogRoutes.js')
const userRouter = require('./routes/userRoutes.js')
const eventRouter = require('./routes/eventRoutes.js')
const extApiRouter = require('./routes/extApiRoutes.js')

// middlewares
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
}))
app.use(express.json())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static('uploads'))
app.use(cookieParser())

app.use('/api/v1/blogs', blogRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/events', eventRouter)
app.use('/api/v1/launches', extApiRouter)

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the ISA Website API!'
  })
})

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'Fail',
    message: `Can't find ${req.originalUrl} on this server!`
  })
  next()
})

module.exports = app
