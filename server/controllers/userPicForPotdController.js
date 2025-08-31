const UserPicForPotd = require('../models/userPicForPotdModel')
const Featured = require('../models/featuredPicModel')
const cloudinary = require('../utils/cloudinary')

// to validate the social link provided
function validateSocialMediaUrl(url) {
  try {
    const parsed = new URL(url)

    // only allow http/https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, reason: 'Only http/https links are allowed.' }
    }

    // extract hostname
    const hostname = parsed.hostname.toLowerCase()

    // allow only specific domains
    const allowedDomains = [
      'facebook.com',
      'instagram.com',
      'twitter.com',
      'x.com',
      'linkedin.com',
      'github.com'
    ]

    if (!allowedDomains.some((d) => hostname.endsWith(d))) {
      return { valid: false, reason: 'Only social media links are allowed.' }
    }

    return { valid: true }
  } catch (err) {
    return { valid: false, reason: err.message }
  }
}

exports.uploadPic = async (req, res) => {
  try {
    const { caption, social } = req.body

    // validate social link if provided
    if (social) {
      const validation = validateSocialMediaUrl(social)
      if (!validation.valid) {
        return res.status(400).json({
          message: 'Invalid social link',
          reason: validation.reason
        })
      }
    }

    const imageUrl = req.file.path

    const image = new UserPicForPotd({
      caption,
      imageUrl: imageUrl,
      socialLink: social || null, // store null if not provided
      publicId: req.file.filename,
      author: req.user.id
    })

    await image.save()
    res.status(201).json({ message: 'Image uploaded successfully', pic: image })
  } catch (err) {
    res.status(500).json({
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