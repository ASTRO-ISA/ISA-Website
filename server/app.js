const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongo_uri = process.env.MONGO_URL;

// DB Connection
mongoose.connect(mongo_uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// routes
const createBlogRoute = require('./routes/createBlog.js');

// middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

app.use('/create/blog', createBlogRoute);

// create blog
// app.post('/create/blog', upload.single('thumbnail'), async (req, res) => {
//   const { title, content } = req.body;
//   const thumbnailPath = req.file?.path;

//   const blog = new Blog({ title, content, thumbnail: thumbnailPath });
//   await blog.save();
//   res.status(201).json({ message: 'Blog saved successfully' });
// });

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
