const express = require('express')
const router = express.Router()
const authenticateToken = require('./../middlewares/authenticateToken')
const restrictTo = require('./../middlewares/restrictTo')
const multer = require('multer')
const { documentStorage } = require('../utils/cloudinaryStorage')
const {
  getAllJobs,
  createJob,
  deleteJob,
  updateJob
} = require('../controllers/JobPostController')

const uploadDocument = multer({ storage: documentStorage('job-attachments') })

router.route('/').get(getAllJobs)

router.use(authenticateToken)
router.use(restrictTo('admin'))

router
  .route('/')

  .post(uploadDocument.single('document'), createJob)
router
  .route('/:id')
  .delete(deleteJob)
  .patch(uploadDocument.single('document'), updateJob)

module.exports = router