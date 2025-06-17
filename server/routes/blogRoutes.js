const express = require('express')
const path = require("path")
const multer = require('multer')
const blogController = require('../controllers/blogController')
const authenticateToken = require('../middlewares/authenticateToken')

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.get('/', blogController.allBlogs)
// router.get('/', blogController.externalBlogs)
router.post('/create', authenticateToken, upload.single('thumbnail'), blogController.createBlog)
router.get('/featured', blogController.featuredBlog)
router.get('/:id', blogController.readBlog)

module.exports = router