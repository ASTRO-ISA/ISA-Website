const express = require('express')
const path = require('path')
const multer = require('multer')
const blogController = require('../controllers/blogController')
const authenticateToken = require('../middlewares/authenticateToken')

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
})

const upload = multer({ storage })

router.route('/').get(blogController.allBlogs)
// router.route().get('/', blogController.externalBlogs)
router
  .route('/create')
  .post(
    authenticateToken,
    upload.single('thumbnail'),
    blogController.createBlog
  )
router.route('/featured').get(blogController.featuredBlog)
router.route('/:id').get(blogController.readBlog)

module.exports = router
