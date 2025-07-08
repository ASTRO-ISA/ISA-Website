const Blog = require('../models/blogModel')
const cloudinary = require('cloudinary').v2

exports.allBlogs = async (req, res) => {
  try {
    const allBlogs = await Blog.find({}).populate('author', 'name country')

    if (!allBlogs) {
      res.status(404).json({ message: 'Nothing to see here right now!' })
    }

    res.status(200).json(allBlogs)
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message })
  }
}

exports.createBlog = async (req, res) => {
  try {
    const imageUrl = req.file.path // we arae saving the url which we are getting from createBlog route
    const publicId = req.file.filename
    const newBlog = new Blog({
      thumbnail: imageUrl,
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      author: req.user.id,
      publicId: publicId
    })
    await newBlog.save()

    res.status(201).json({ message: 'Blog saved successfully.', blog: newBlog })
    // console.log(newBlog)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to save blog.', error: err })
  }
}

exports.featuredBlog = async (req, res) => {
  try {
    const featuredBlog = await Blog.findOne({ featured: true }).populate(
      'author',
      'name country'
    )
    if (!featuredBlog) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    res.status(200).json(featuredBlog)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'server error in featured', error: err.message })
  }
}

exports.readBlog = async (req, res) => {
  try {
    const { id } = req.params
    const blog = await Blog.findById(id).populate('author', 'name country')

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    res.status(200).json(blog)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'server error in readblog', error: err.message })
  }
}

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params
    const blog = await Blog.findById(id)
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    if (blog.authorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await cloudinary.uploader.destroy(blog.publicId)
    await blog.deleteOne()
    res.status(200).json(blog)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'server error in readblog', error: err.message })
  }
}