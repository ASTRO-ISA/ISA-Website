const UserPicForPotd = require('../models/userPicForPotdModel')
const Featured = require('../models/featuredPicModel')
const cloudinary = require('../utils/cloudinary')
const User = require('../models/userModel')

exports.uploadPic = async (req, res) => {
    try {
      const imageUrl = req.file.path
      const image = new UserPicForPotd({
        caption: req.body.caption,
        imageUrl: imageUrl,
        socialLink: req.body.social,
        publicId: req.file.filename,
        author: req.user.id
      })
      await image.save()
      res
        .status(201)
        .json({ message: 'Image uploaded successfully', pic: image })
    } catch (err) {
      res
        .status(500)
        .json({
          message: 'Server error in uploadPic',
          error: err.message
        })
    }
}

exports.deletePic = async (req, res) => {
    try {
      const { id } = req.params
      const image = await UserPicForPotd.findById(id)
      if (!image) {
        return res.status(404).json({ message: 'Image not found' })
      }
  
      await cloudinary.uploader.destroy(image.publicId)
      await image.deleteOne()
  
      res.status(204).json({ message: 'Deleted successfully' })
    } catch (err) {
      res
        .status(500)
        .json({
          message: 'Server error in deleteFeatured',
          error: err.message
        })
    }
}

exports.getAllPics = async (req, res) => {
    try {
      const pics = await UserPicForPotd.find({})
      if (!pics) {
        res.status(404).json({ message: 'Nothing to see here right now!' })
      }
      res.status(200).json(pics)
    } catch (err) {
      res
        .status(500)
        .json({
          message: 'Server error in getAllPics',
          error: err.message
        })
    }
}

exports.setFeaturedFromUserPic = async (req, res) => {
  const { imageId } = req.body

  try {
    const userPic = await UserPicForPotd.findById(imageId).populate('author', 'name avatar')
    if (!userPic) return res.status(404).json({ message: 'User image not found' })

    const featured = await Featured.create({
      caption: userPic.caption,
      imageUrl: userPic.imageUrl,
      publicId: userPic.publicId,
      socialLink: userPic.socialLink,
      author: userPic.author || 'user',
    })

    res.status(200).json({ message: 'Image set as featured', data: featured })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}