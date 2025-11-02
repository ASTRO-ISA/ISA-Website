const { default: slugify } = require('slugify')
const Blog = require('../models/blogModel')
const cloudinary = require('cloudinary').v2
const { sendEmail } = require('../utils/sendEmail')

exports.pendingBlogs = async (req, res) => {
  try {
    const allBlogs = await Blog.find({ status: 'pending' }).populate(
      'author',
      'name avatar'
    )

    if (!allBlogs) {
      res.status(404).json({ message: 'Nothing to see here right now!' })
    }

    res.status(200).json(allBlogs)
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message })
  }
}

exports.approvedBlogs = async (req, res) => {
  try {
    const approvedBlogs = await Blog.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar')

    if (!approvedBlogs) {
      res.status(404).json({ message: 'Nothing to see here right now!' })
    }

    res.status(200).json(approvedBlogs)
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message })
  }
}

exports.createBlog = async (req, res) => {
  try {
    const imageUrl = req.file.path // we are saving the url which we are getting from createBlog route
    const publicId = req.file.filename
    const slug = slugify(req.body.title, {
      lower: true,
      strict: true
    })
    const newBlog = new Blog({
      thumbnail: imageUrl,
      title: req.body.title,
      slug: slug,
      description: req.body.description,
      content: req.body.content,
      author: req.user.id,
      publicId: publicId
    })
    await newBlog.save()

    const html = `
      <p>Hello ${req.user.name},</p>

      <p>Thank you for submitting your blog <strong>"${newBlog.title}"</strong> to ISA.</p>

      <p>Your blog is currently under review by our admin team to ensure quality and relevance.  
      Once reviewed, you’ll receive an email notification letting you know whether your blog has been approved or rejected.</p>

      <p>While you wait, you can preview your submission here:  
      <a href="${process.env.CLIENT_URL}/blogs/${newBlog.slug}" target="_blank">View Blog</a></p>

      <p>We appreciate your contribution and look forward to sharing your work with the ISA community!</p>

      <p>Best regards,<br>
      Team ISA</p>
    `

    await sendEmail(
      req.user.email,
      `Your blog "${newBlog.title}" has been submitted`,
      html
    )

    res.status(201).json({ message: 'Blog saved successfully.', blog: newBlog })
  } catch (err) {
    res.status(500).json({ message: 'Failed to save blog.', error: err })
  }
}

exports.featuredBlog = async (req, res) => {
  try {
    const featuredBlog = await Blog.findOne({ featured: true }).populate(
      'author',
      'name'
    )
    // if (!featuredBlog) {
    //   return res.status(404).json({ message: 'Blog not found' })
    // }
    res.status(200).json(featuredBlog || null)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'server error in featured', error: err.message })
  }
}

exports.readBlog = async (req, res) => {
  try {
    const { slug } = req.params
    const blog = await Blog.findOne({ slug: slug }).populate(
      'author',
      'name avatar'
    )

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
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' })
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

exports.changeStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, response } = req.body

    const blog = await Blog.findByIdAndUpdate(
      id,
      { status: status, response: response },
      { new: true, runValidators: true }
    ).populate('author', 'name email')

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }

    if (status === 'approved') {
      const text = `
        <p>Hello ${blog.author.name},</p>

        <p>Great news! Your blog <strong>'${blog.title}'</strong> 
        has been <span style="color:green;font-weight:bold;">approved</span> 
        and is now live on ISA.</p>

        <p>You can view your blog here:  
        <a href='${process.env.CLIENT_URL}/blogs/${blog.id}' target='_blank'>Read Blog</a></p>

        <p>Thank you for sharing your knowledge with the ISA community—we’re thrilled to have your contribution published!</p>

        <p>Best regards,<br>
        Team ISA</p>
      `
      await sendEmail(
        blog.author.email,
        `Your blog '${blog.title}' is now live!`,
        text
      )
    }

    if (status === 'rejected') {
      const text = `
        <p>Hello ${blog.author.name},</p>

        <p>We regret to inform you that your blog <strong>'${blog.title}'</strong> 
        has been <span style='color:red;font-weight:bold;'>rejected</span> after review.</p>

        <p><strong>Reason from Admin:</strong></p>
        <blockquote style='border-left: 3px solid #ccc; margin: 10px 0; padding-left: 10px; color:#555;'>
          ${blog.adminComment || 'No specific reason provided.'}
        </blockquote>

        <p>You may revise and resubmit your blog for review if you’d like to address the feedback.</p>

        <p>We truly value your effort and encourage you to keep contributing your insights to the ISA platform.</p>

        <p>Best regards,<br>
        Team ISA</p>
      `
      await sendEmail(
        blog.author.email,
        `Update on your blog: ${blog.title}`,
        text
      )
    }

    res.status(200).json({ message: `Blog status updated to ${status}` })
  } catch (err) {
    res.status(500).json({
      message: 'Server error while updating blog status',
      error: err.message
    })
  }
}

exports.userBlogs = async (req, res) => {
  try {
    const { userid } = req.params
    const blogs = await Blog.find({ author: userid })
      .sort({ createdAt: -1 })
      .populate('author', 'name')
    if (!blogs) {
      res.status(404).json({ message: 'No user blogs found.' })
    }
    res.status(200).json(blogs)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Server error finding user blogs.', error: err.message })
  }
}
