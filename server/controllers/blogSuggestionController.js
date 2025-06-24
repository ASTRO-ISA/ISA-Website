const BlogSuggestion = require('../models/blogSuggestion')

exports.getAllBlogSuggestions = async (req, res) => {
  try {
    const response = await BlogSuggestion.find().populate(
      'submittedBy',
      'name email'
    )
    res.status(200).json({ status: 'success', data: response })
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error })
  }
}

exports.postSuggestedBlog = async (req, res) => {
  try {
    const { title, description } = req.body

    if (!title || !description) {
      return res.status(400).json({
        status: 'fail',
        message: 'Title or description not provided'
      })
    }

    req.body.submittedBy = req.user.id

    const response = await BlogSuggestion.create(req.body)

    res.status(201).json({ status: 'success', data: response })
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error })
  }
}

exports.deleteSuggestedBlog = async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Provide a valid id' })
    }
    const response = await BlogSuggestion.findByIdAndDelete(id)
    res.status(204).json({ status: 'success', data: response })
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error })
  }
}

exports.updateSuggestedBlog = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Provide a valid id' })
    }

    console.log(req.body)

    const response = await BlogSuggestion.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })

    if (!response) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Blog suggestion not found' })
    }

    res.status(200).json({ status: 'success', data: response })
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message })
  }
}
