const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
require('dotenv').config({ path: __dirname + '/.env' })

// routes
const blogRouter = require('./routes/blogRoutes.js')
const userRouter = require('./routes/userRoutes.js')
const eventRouter = require('./routes/eventRoutes.js')
const extApiRouter = require('./routes/extApiRoutes.js')
const blogSuggestionRouter = require('./routes/blogSuggestionRoutes.js')
const jobRouter = require('./routes/jobRoutes.js')
const galleryRouter = require('./routes/galleryRoutes.js')
const researchPaperRouter = require('./routes/researchPaperRoutes.js')
const courseRouter = require('./routes/courseRoutes.js')
const featuredRouter = require('./routes/featuredRoutes.js')
const webinarRouter = require('./routes/webinarRoutes.js')
const newsletterRouter = require('./routes/newsletterRoutes.js')
const userPicsPotdRouter = require('./routes/userPicsPotdRoutes.js')
const superAdminRouter = require('./routes/superAdminRoutes.js')

// middlewares
app.use(helmet())
app.use(
  cors({
    origin: 'http://localhost:8080',
    credentials: true
  })
)
app.use(express.json())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static('uploads'))
app.use(cookieParser())

app.use('/api/v1/super-admin', superAdminRouter)
app.use('/api/v1/research-papers', researchPaperRouter)
app.use('/api/v1/jobs', jobRouter)
app.use('/api/v1/courses', courseRouter)
app.use('/api/v1/suggest-blog', blogSuggestionRouter)
app.use('/api/v1/blogs', blogRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/events', eventRouter)
app.use('/api/v1/launches', extApiRouter)
app.use('/api/v1/external-blogs', extApiRouter)
app.use('/api/v1/news', extApiRouter)
app.use('/api/v1/picture', extApiRouter)
app.use('/api/v1/gallery', galleryRouter)
app.use('/api/v1/blogs/featured', featuredRouter)
app.use('/api/v1/webinars', webinarRouter)
app.use('/api/v1/newsletter', newsletterRouter)
app.use('/api/v1/user-potd-pics', userPicsPotdRouter)

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
