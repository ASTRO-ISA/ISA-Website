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
  changeStatus,
  userPapers
} = require('../controllers/researchPaperController')

const uploadDocument = multer({
  storage: documentStorage('researchPaper-attachments')
})

router.use(authenticateToken)
router.route('/').get(approvedPapers)
router.route('/my-papers/:userId').get(userPapers)
router.route('/').post(uploadDocument.single('file'), uploadPaper)
router.use(restrictTo(['admin', 'super-admin']))
router.route('/all').get(pendingPapers)
router.route('/status/:id').patch(changeStatus)
router
  .route('/:id')
  .patch(uploadDocument.single('file'), updatePaper)
  .delete(deletePaper)

module.exports = router
