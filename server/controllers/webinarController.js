const Webinar = require('../models/webinarModel')
const User = require('../models/userModel')
const {sendEmail} = require('../utils/sendEmail')
const getVideoId = require('../utils/getVideoId')
const cloudinary = require('cloudinary').v2

exports.createWebinar = async (req, res) => {
  try {
    const { title, description, webinarDate, type, presenter, videoLink } =
      req.body

    // to extract video id from the link
    const videoId = getVideoId(videoLink)
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube video link.' })
    }
    const thumbnail = req.file ? req.file.path : '' // from cludinary
    const publicId = req.file.filename
    const webinar = new Webinar({
      thumbnail,
      title,
      description,
      webinarDate,
      type,
      presenter,
      videoId,
      publicId
    })

    await webinar.save()

    res.status(201).json({ message: 'Webinar created successfully', webinar })
  } catch (error) {
    console.log('Failed to create webinar!', error)
    res.status(500).json(error)
  }
}

exports.Webinars = async (req, res) => {
  try {
    const webinars = await Webinar.find({})
    if (!webinars) {
      return res.status(404).json({ message: 'Webinar not found' })
    }
    res.status(200).json(webinars)
  } catch (err) {
    console.log('failed to featch webinars:', err)
    res.status(500).json({ message: 'Server error in get webinars' })
  }
}

// exports.getWebinar = async (req, res) => {
//   const { id } = req.params
//   try {
//     const webinar = await Webinar.findById(id)
//     if (!webinar) {
//       return res.status(404).json({ message: 'Webinar not found' })
//     }
//     res.status(200).json(webinar)
//   } catch (err) {
//     console.log('Failed to fetch webinar:', err)
//     res.status(500).json({ message: 'Server error in get webinar' })
//   }
// }

exports.registerWebinar = async (req, res) => {
  try {
    const { webinarid, userid } = req.params

    const webinar = await Webinar.findById(webinarid)
    const user = await User.findById(userid)

    if (!user) {
      return res.status(400).json({ message: 'Please make login' })
    }
    if (!webinar) {
      return res.status(400).json({ message: 'Webinar not found' })
    }

    const updatedWebinar = await Webinar.findByIdAndUpdate(
      webinarid,
      { $addToSet: { attendees: userid } },
      { new: true }
    ).populate('attendees', 'name email')

    // sending confirmation email
    const text = `Hi ${user.name},
    You have successfully registered for "${webinar.title}" on ${new Date(webinar.webinarDate).toDateString()}.
    See you there!
    – ISA`

    await sendEmail(user.email, `Registered for ${webinar.title}`, text)

    res.status(200).json({
      success: true,
      message: 'User successfully registered for the webinar',
      data: updatedWebinar
    })
  } catch (error) {
    console.error('Error in registration:', error)
    res.status(500).json({
      success: false,
      message: 'User registration failed for the event'
    })
  }
}

exports.updatedWebinar = async (req, res) => {
  const { id } = req.params
  const updates = req.body

  try {
    const webinar = await Webinar.findByIdAndUpdate(id, updates, { new: true })
    if (!webinar) return res.status(404).json({ message: 'Webinar not found' })
    res.status(200).json(webinar)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating webinar', error: error.message })
  }
}

exports.deleteWebinar = async (req, res) => {
  const { id } = req.params
  try {
    const webinar = await Webinar.findById(id)
    if (webinar.publicId) {
      await cloudinary.uploader.destroy(webinar.publicId, {
        resource_type: 'raw'
      })
    }
    await Webinar.findByIdAndDelete(id)
    if (!webinar) return res.status(404).json({ message: 'webinar not found' })
    res.status(200).json({ message: 'webinar deleted successfully' })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error deleting webinar', error: err.message })
  }
}

exports.setFeatured = async (req, res) => {
  try {
    const { id } = req.params
    await Webinar.findByIdAndUpdate(id, { featured: true })
    res.status(200).json({ message: 'Webinar set as featured.' })
  } catch (error) {
    res.status(500).json({
      message: 'Error setting webinar as featured!',
      error: error.message
    })
  }
}

exports.getFeatured = async (req, res) => {
  try {
    const getFeatured = await Webinar.findOne({ featured: true })
    if (!getFeatured) {
      return res.status(404).json({ message: 'No featured webinar.' })
    }
    res.status(200).json(getFeatured)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Server error in getFeatured', error: error.message })
  }
}

exports.removeFeatured = async (req, res) => {
  try {
    const { id } = req.params
    await Webinar.findByIdAndUpdate(id, { featured: false })
    res.status(200).json({ message: 'Webinar removed from featured.' })
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Error removing webinar as featured!',
        error: error.message
      })
  }
}
