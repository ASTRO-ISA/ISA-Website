const Blog = require('../models/blogModel')

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
    // console.log(req.file)
    const imageUrl = req.file.path // we arae saving the url which we are getting from createBlog route
    const newBlog = new Blog({
      thumbnail: imageUrl,
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      author: req.user.id
    })
    await newBlog.save()

    res.status(201).json({ message: 'Blog saved successfully.', blog: newBlog })
    // console.log(newBlog)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to save blog.', error: err.message })
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
