const BlogSuggestion = require('../models/blogSuggestion')

exports.getAllBlogSuggestions = async (req, res) => {
  try {
    const filter = {}
    if (req.query.status) filter.status = req.query.status

    const response = await BlogSuggestion.find(filter).populate(
      'submittedBy',
      'name email'
    )
    res.status(200).json({ status: 'success', data: response })
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message })
  }
}

exports.BlogSuggestedByUser = async (req, res) => {
  try {
    const response = await BlogSuggestion.find({
      submittedBy: req.user._id
    }).populate('submittedBy', 'name email')
    res.status(200).json({ status: 'success', data: response })
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message })
  }
}

// exports.pendingBlogSuggestions = async (req, res) => {
//   try {
//     const blogs = await BlogSuggestion.find({ status: 'pending' })
//       .sort({ createdAt: -1 })
//       .populate('submittedBy', 'name email')

//     res.status(200).json(blogs)
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: 'Server error getting pending blogs.', err })
//   }
// }
exports.pendingBlogSuggestions = async (req, res) => {
  try {
    const blogs = await BlogSuggestion.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .populate('submittedBy', 'name email')
      .lean() // .lean() returns plain js object instead of pure mongoose document (more fast) / use only while you want to display only on frontend

    // sanitizing the response before sending it to frontend to prevent accidental null and crashes
    const safeBlogs = blogs.map((b) => ({
      _id: b._id,
      title: b.title || 'Untitled',
      description: b.description || 'No description provided',
      status: b.status || 'pending',
      response: b.response || '',
      createdAt: b.createdAt,
      submittedBy: b.submittedBy
        ? {
            email: b.submittedBy.email || 'Unknown',
            name: b.submittedBy.name || 'Anonymous'
          }
        : { email: 'Unknown', name: 'Anonymous' }
    }))

    res.status(200).json({ status: 'success', data: safeBlogs })
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'Server error getting pending blogs.',
      error: err.message
    })
  }
}

exports.approvedBlogSuggestions = async (req, res) => {
  try {
    const blogs = await BlogSuggestion.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .populate('submittedBy', 'name email')

    res.status(200).json(blogs)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Server error getting pending blogs.', err })
  }
}

exports.postSuggestedBlog = async (req, res) => {
  try {
    const { title, description } = req.body
    if (!title || !description) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Title or description not provided' })
    }

    req.body.submittedBy = req.user.id
    const response = await BlogSuggestion.create(req.body)

    res.status(201).json({ status: 'success', data: response })
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message })
  }
}

exports.deleteSuggestedBlog = async (req, res) => {
  try {
    const { id } = req.params
    const response = await BlogSuggestion.findByIdAndDelete(id)
    if (!response) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Suggestion not found' })
    }
    res.status(204).json({ status: 'success', data: null })
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message })
  }
}

exports.updateSuggestedBlog = async (req, res) => {
  try {
    const { id } = req.params
    const response = await BlogSuggestion.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })
    if (!response) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Suggestion not found' })
    }
    res.status(200).json({ status: 'success', data: response })
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message })
  }
}
