const express = require('express')
const router = express.Router()
const authenticateToken = require('../middlewares/authenticateToken')
const restrictTo = require('../middlewares/restrictTo')
const multer = require('multer')
const { imageStorage } = require('../utils/cloudinaryStorage')
const {
  getAllCourses,
  createCourse,
  deleteCourse
} = require('../controllers/courseController')

const uploadCourseImage = multer({ storage: imageStorage('courses') })

router.get('/', getAllCourses)

router.use(authenticateToken)
router.use(restrictTo(['admin', 'super-admin']))
router.post('/create', uploadCourseImage.single('image'), createCourse)
router.delete('/:id', deleteCourse)

module.exports = router
