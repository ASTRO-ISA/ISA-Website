const Webinar = require('../models/webinarModel')
const User = require('../models/userModel')
const sendEmail = require('../utils/sendEmail')
const getVideoId = require("../utils/getVideoId")

exports.createWebinar = async (req, res) => {
  try {
    const {
        title,
        description,
        webinarDate,
        type,
        presenter,
        videoLink,
    } = req.body

    // to extract video id from the link
    const videoId = getVideoId(videoLink)
    if (!videoId) {
    return res.status(400).json({ error: "Invalid YouTube video link." })
    }
    const thumbnail = req.file ? req.file.path : '' // from cludinary
    const webinar = new Webinar({
        thumbnail,
        title,
        description,
        webinarDate,
        type,
        presenter,
        videoId
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

exports.getWebinar = async (req, res) => {
  const { id } = req.params
  try {
    const webinar = await Webinar.findById(id)
    if (!webinar) {
      return res.status(404).json({ message: 'Webinar not found' })
    }
    res.status(200).json(webinar)
  } catch (err) {
    console.log('Failed to fetch webinar:', err)
    res.status(500).json({ message: 'Server error in get webinar' })
  }
}

exports.registerWebinar = async (req, res) => {
  try {
    const { webinarid, userid } = req.params

    const webinar = await Webinar.findById(eventid)
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
    – ISA`;

    await sendEmail(user.email, `Registered for ${webinar.title}`, text);

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
        res.status(500).json({ message: 'Error updating webinar', error })
    }
}

exports.deleteWebinar = async (req, res) => {
    const { id } = req.params;
    try {
        const webinar = await Webinar.findByIdAndDelete(id);
        if (!webinar) return res.status(404).json({ message: 'webinar not found' });
        res.status(200).json({ message: 'webinar deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting webinar', error });
    }
}

exports.featuredWebinar = async (req, res) => {
  try {
    const featuredWebinar = await Webinar.findOne({ featured: true })
    if (!featuredWebinar) {
      return res.status(404).json({ message: 'Webinar not found' })
    }
    res.status(200).json(featuredWebinar)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'server error in featured', error: err.message })
  }
}