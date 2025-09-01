const express = require('express')
const router = express.Router()
const authenticateToken = require('./../middlewares/authenticateToken')
const restrictTo = require('./../middlewares/restrictTo')
const multer = require('multer')
const { documentStorage } = require('../utils/cloudinaryStorage')
const {
  pendingPapers,
  deletePaper,
  updatePaper,
  uploadPaper,
  approvedPapers,
  rejectedPapers,
  changeStatus,
  userPapers,
  allPapers,
  userApprovedPapers
} = require('../controllers/researchPaperController')

const uploadDocument = multer({
  storage: documentStorage('researchPaper-attachments')
})

// public
router.route('/approved').get(approvedPapers)

// user
router.use(authenticateToken)
router.route('/my-papers/:userId').get(userPapers)
router.route('/my-approved-papers/:userId').get(userApprovedPapers)
router
  .route('/upload-paper')
  .post(uploadDocument.single('file'), uploadPaper)

// admin
router.use(restrictTo(['admin', 'super-admin']))
router.route('/all').get(allPapers)
router.route('/pending').get(pendingPapers)
router.route('/rejected').get(rejectedPapers)
router.route('/status/:id').patch(changeStatus)
router
  .route('/:id')
  .patch(uploadDocument.single('file'), updatePaper)
  .delete(deletePaper)

module.exports = router
