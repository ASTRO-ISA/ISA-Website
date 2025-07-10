const express = require('express')
const path = require('path')
const multer = require('multer')
const blogController = require('../controllers/blogController')
const authenticateToken = require('../middlewares/authenticateToken')
const { imageStorage } = require('../utils/cloudinaryStorage')

const router = express.Router()

const uploadImage = multer({ storage: imageStorage('blog-thumbnails')})

router.route('/').get(blogController.allBlogs)
router
  .route('/create')
  .post(
    authenticateToken,
    uploadImage.single('thumbnail'),
    blogController.createBlog
  )

router.route('/featured').get(blogController.featuredBlog)

router
  .route('/delete/:id')
  .delete(
    authenticateToken,
    blogController.deleteBlog
  )

router.route('/:id').get(blogController.readBlog)

module.exports = router
