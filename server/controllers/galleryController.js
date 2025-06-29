const Gallery = require("../models/galleryModel")
const cloudinary = require('../utils/cloudinary')

exports.uploadPics = async (req, res) => {
    try{
        const cldImage = req.file.path
        const newPic = new Gallery({
            caption: req.body.caption,
            imageUrl: cldImage,
            createdAt: req.body.createdAt
        })
        await newPic.save()
        res.status(201).json({message:'Image uploaded successfully', pic: newPic})
    } catch (err) {
        res.status(500).json({ message: 'something went wrong in uploadPics'})
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
    await Gallery.findByIdAndDelete(id)

    res.status(204).json({ message: 'Deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong in deletePics' })
  }
}

exports.allPics = async (req, res) => {
    try{
        const pics = await Gallery.find({})
        if (!pics) {
            res.status(404).json({ message: 'Nothing to see here right now!' })
        }
        res.status(200).json(pics)
    } catch (err) {
        res.status(500).json({ message: 'something went wrong in getallpics'})
    }
}