const express = require('express')
const multer = require('multer')
const blogController = require('../controllers/blogController')
const authenticateToken = require('../middlewares/authenticateToken')
const { imageStorage } = require('../utils/cloudinaryStorage')
const rateLimit = require('express-rate-limit')
const router = express.Router()
const restrictTo = require('../middlewares/restrictTo')

const uploadImage = multer({ storage: imageStorage('blog-thumbnails') })

const publishLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: 2,
  message: 'You can only publish 2 blogs a day.'
})

router.route('/').get(blogController.approvedBlogs)
router.route('/featured').get(blogController.featuredBlog)
router
  .route('/all')
  .get(
    authenticateToken,
    restrictTo('admin'),
    blogController.pendingBlogs
  )
router.route('/:slug').get(blogController.readBlog)

router.use(authenticateToken)
router.route('/my-blogs/:userid').get(blogController.userBlogs)
router
  .route('/create')
  .post(
    publishLimit,
    uploadImage.single('thumbnail'),
    blogController.createBlog
  )
router.route('/delete/:id').delete(blogController.deleteBlog)

router.use(restrictTo('admin'))
router.route('/status/:id').patch(blogController.changeStatus)

module.exports = router
