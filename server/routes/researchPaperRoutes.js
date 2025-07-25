const express = require('express')
const router = express.Router()
const authenticateToken = require('./../middlewares/authenticateToken')
const restrictTo = require('./../middlewares/restrictTo')
const multer = require('multer')
const { documentStorage } = require('../utils/cloudinaryStorage')
const {
  getAllPapers,
  deletePaper,
  updatePaper,
  uploadPaper
} = require('../controllers/researchPaperController')

const uploadDocument = multer({
  storage: documentStorage('researchPaper-attachments')
})

router.route('/').get(getAllPapers)
router.use(authenticateToken)

router.use(restrictTo('admin'))
router.route('/').post(uploadDocument.single('file'), uploadPaper)
router
  .route('/:id')
  .patch(uploadDocument.single('file'), updatePaper)
  .delete(deletePaper)

module.exports = router