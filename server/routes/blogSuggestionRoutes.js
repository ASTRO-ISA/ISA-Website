// routes/blogSuggestionRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const restrictTo = require('../middlewares/restrictTo');
const {
  getAllBlogSuggestions,
  postSuggestedBlog,
  deleteSuggestedBlog,
  updateSuggestedBlog,
  approvedBlogSuggestions,
  pendingBlogSuggestions
} = require('../controllers/blogSuggestionController');
const rateLimit = require('express-rate-limit');

const suggestionLimit = rateLimit({
  windowMs: 7 * 24 * 60 * 60 * 1000,
  limit: 1,
  message: 'You can only suggest a blog per week.'
})

router.use(authenticateToken)
router.route('/').post(suggestionLimit, postSuggestedBlog)

router.use(restrictTo('admin'))
router.route('/pending').get(pendingBlogSuggestions)
router.route('/approved').get(approvedBlogSuggestions)
router.route('/:id').delete(deleteSuggestedBlog).patch(updateSuggestedBlog)

module.exports = router
