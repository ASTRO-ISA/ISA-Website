const Gallery = require('../models/galleryModel')
const Featured = require('../models/featuredPicModel')
const cloudinary = require('../utils/cloudinary')

exports.uploadFeatured = async (req, res) => {
  try {
    const cldImage = req.file.path
    const newFeatured = new Featured({
      caption: req.body.caption,
      imageUrl: cldImage,
      publicId: req.file.filename,
      author: req.user.id
    })
    await newFeatured.save()
    res
      .status(201)
      .json({ message: 'Image uploaded successfully', pic: newFeatured })
  } catch (err) {
    res
      .status(500)
      .json({
        message: 'something went wrong in uploadFeatured',
        error: err.message
      })
  }
}

exports.deleteFeatured = async (req, res) => {
  try {
    const { id } = req.params
    const image = await Featured.findById(id)
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
        message: 'Something went wrong in deleteFeatured',
        error: err.message
      })
  }
}

exports.getFeatured = async (req, res) => {
  try {
    const pics = await Featured.find({}).populate('author', 'name avatar')
    if (!pics) {
      res.status(404).json({ message: 'Nothing to see here right now!' })
    }
    res.status(200).json(pics)
  } catch (err) {
    res
      .status(500)
      .json({
        message: 'something went wrong in getallpics',
        error: err.message
      })
  }
}

exports.uploadPics = async (req, res) => {
  try {
    const cldImage = req.file.path
    const newPic = new Gallery({
      caption: req.body.caption,
      imageUrl: cldImage,
      publicId: req.file.filename
    })
    await newPic.save()
    res
      .status(201)
      .json({ message: 'Image uploaded successfully', pic: newPic })
  } catch (err) {
    res
      .status(500)
      .json({
        message: 'something went wrong in uploadPics',
        error: err.message
      })
  }
}

exports.deletePics = async (req, res) => {
  try {
    const { id } = req.params
    const image = await Gallery.findById(id)
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
        message: 'Something went wrong in deletePics',
        error: err.message
      })
  }
}

exports.allPics = async (req, res) => {
  try {
    const pics = await Gallery.find({})
    if (!pics) {
      res.status(404).json({ message: 'Nothing to see here right now!' })
    }
    res.status(200).json(pics)
  } catch (err) {
    res
      .status(500)
      .json({
        message: 'something went wrong in getallpics',
        error: err.message
      })
  }
}
