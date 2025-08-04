// controllers/blogSuggestionController.js
const BlogSuggestion = require('../models/BlogSuggestion');

exports.getAllBlogSuggestions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const response = await BlogSuggestion.find(filter).populate('submittedBy', 'name email');
    res.status(200).json({ status: 'success', data: response });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};

exports.postSuggestedBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ status: 'fail', message: 'Title or description not provided' });
    }
    req.body.submittedBy = req.user.id;

    const response = await BlogSuggestion.create(req.body);
    res.status(201).json({ status: 'success', data: response });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};

exports.deleteSuggestedBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await BlogSuggestion.findByIdAndDelete(id);
    if (!response) {
      return res.status(404).json({ status: 'fail', message: 'Suggestion not found' });
    }
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};

exports.updateSuggestedBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await BlogSuggestion.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    if (!response) {
      return res.status(404).json({ status: 'fail', message: 'Suggestion not found' });
    }
    res.status(200).json({ status: 'success', data: response });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};
