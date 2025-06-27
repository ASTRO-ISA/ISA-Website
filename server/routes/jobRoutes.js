const express = require('express')
const router = express.Router()
const authenticateToken = require('./../middlewares/authenticateToken')
const restrictTo = require('./../middlewares/restrictTo')
const {
  getAllJobs,
  createJob,
  deleteJob,
  updateJob
} = require('../controllers/JobPostController')

router.use(authenticateToken)
router.use(restrictTo('admin'))

router.route('/').get(getAllJobs).post(createJob)
router.route('/:id').delete(deleteJob).patch(updateJob)

module.exports = router
