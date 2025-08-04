// routes/blogSuggestionRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const restrictTo = require('../middlewares/restrictTo');
const {
  getAllBlogSuggestions,
  postSuggestedBlog,
  deleteSuggestedBlog,
  updateSuggestedBlog
} = require('../controllers/blogSuggestionController');

router.use(authenticateToken);
router.route('/').post(postSuggestedBlog);

router.use(restrictTo('admin'));
router.route('/').get(getAllBlogSuggestions);
router.route('/:id').delete(deleteSuggestedBlog).patch(updateSuggestedBlog);

module.exports = router;
