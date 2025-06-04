const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')

// routes
const blogRouter = require('./routes/blogRoutes.js')
// const allBlogsRoute = require('./routes/allBlogs.js');
// const createBlogRoute = require('./routes/createBlog.js');
// const readBlogRoute = require('./routes/readBlog.js');
const userRouter = require('./routes/userRoutes.js')

// middlewares
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static('uploads'))

// app.use('/blogs', allBlogsRoute);
app.use('/api/v1/blogs', blogRouter);
// app.use('/api/v1/create/blog', createBlogRoute);
// app.use('/', readBlogRoute);
app.use('/api/v1/users', userRouter)

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
