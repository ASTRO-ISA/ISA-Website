const User = require('../models/userModel')
const cloudinary = require('cloudinary').v2

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')

    res.status(200).json({ status: 'success', user })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'No ID provided in jobUpdater' })
    }

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ message: 'user does not exist' })
    }

    if ((!req.body || Object.keys(req.body).length === 0) && !req.file) {
      return res.status(400).json({
        status: 'fail',
        message: 'No data or document provided to update'
      })
    }

    if (user.role === 'admin' && req.body.name) {
      return res.status(403).json({
        status: 'fail',
        message: 'Admins are not allowed to change their name'
      })
    }

    // only handle document if new one is uploaded
    if (req.file) {
      req.body.avatar = req.file.path
      req.body.avatarPublicId = req.file.filename

      // remove old doc from Cloudinary
      if (user.avatarPublicId) {
        await cloudinary.uploader.destroy(user.avatarPublicId)
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      status: 'success',
      message: 'user updated',
      data: updatedUser
    })
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Server error, cannot update User',
      error: error.message
    })
  }
}

exports.getSavedBlogs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedBlogs',
      populate: {
        path: 'author',
        select: 'name'
      }
    })

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      })
    }

    res.status(200).json({
      status: 'success',
      savedBlogs: user.savedBlogs
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong while saving the blog',
      error: error.message
    })
  }
}

exports.saveBlog = async (req, res) => {
  try {
    const { blogid } = req.params

    if (!blogid) {
      return res.status(400).json({
        status: 'fail',
        message: 'No blogId provided'
      })
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { savedBlogs: blogid } },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Blog saved successfully',

      savedBlogs: user.savedBlogs
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong while saving the blog',
      error: error.message
    })
  }
}

exports.unSaveBlog = async (req, res) => {
  try {
    const { blogid } = req.params

    if (!blogid) {
      return res.status(400).json({
        status: 'fail',
        message: 'No blogId provided'
      })
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { savedBlogs: blogid } },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Blog deleted successfully',
      savedBlogs: user.savedBlogs
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong while unsaving the blog',
      error: error.message
    })
  }
}
