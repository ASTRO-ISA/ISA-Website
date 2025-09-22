const express = require('express')
const userController = require('../controllers/userController')
const authenticateToken = require('../middlewares/authenticateToken')
const multer = require('multer')
const { imageStorage } = require('../utils/cloudinaryStorage')
const router = express.Router()
const rateLimit = require('express-rate-limit')

const uploadImage = multer({ storage: imageStorage('user-image') })

const updateUserLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: 1,
  message: 'To many update requests. Try again later.'
})

router.use(authenticateToken)

router
  .route('/updateUser/:id')
  .patch(
    updateUserLimiter,
    uploadImage.single('avatar'),
    userController.updateUser
  )

// protected route to check if the user is logged in
router.route('/me').get(userController.getMe)
router.route('/saved-blogs').get(userController.getSavedBlogs)
router.route('/save-blog/:blogid').patch(userController.saveBlog)
router.route('/unsave-blog/:blogid').delete(userController.unSaveBlog)

module.exports = router
