const Webinar = require('../models/webinarModel')
const User = require('../models/userModel')
const { sendEmail } = require('../utils/sendEmail')
const getVideoId = require('../utils/getVideoId')
const cloudinary = require('cloudinary').v2
const { default: slugify } = require('slugify')
const { v4: uuidv4 } = require('uuid')
const QRCode = require('qrcode')
const { sendEmailWithAttachment } = require('../utils/sendEmail')
const PaymentTransaction = require('../models/transactionsModel')
const webinarEmailTemplate = require('../templates/webinarEmailTemplate')

exports.createWebinar = async (req, res) => {
  try {
    let {
      title,
      description,
      webinarDate,
      presenter,
      guests,
      videoLink,
      isFree,
      fee,
    } = req.body

    // Convert values from string -> proper types
    isFree = isFree === "true" || isFree === true
    if (!isFree) {
      fee = Number(fee)
      if (isNaN(fee) || fee <= 0) {
        return res.status(400).json({ error: "Fee must be a valid number" })
      }
    } else {
      fee = null
    }

    const videoId = getVideoId(videoLink)
    if (!videoId) {
      return res.status(400).json({ error: "Invalid YouTube video link." })
    }

    const thumbnail = req.file ? req.file.path : ""
    const publicId = req.file ? req.file.filename : ""
    const slug = slugify(title, { lower: true, strict: true })

    const webinarData = {
      thumbnail,
      publicId,
      title,
      slug,
      description,
      webinarDate,
      presenter,
      guests: Array.isArray(guests) ? guests : guests ? [guests] : [],
      videoId,
      isFree,
      fee,
    }

    const webinar = new Webinar(webinarData)
    await webinar.save()

    res.status(201).json({ message: "Webinar created successfully", webinar })
  } catch (error) {
    console.error("Failed to create webinar", error)
    res.status(500).json(error)
  }
}

exports.Webinars = async (req, res) => {
  try {
    const webinars = await Webinar.find({}).populate('attendees.user', 'name email');
    // if (!webinars || webinars.length === 0) {
    //   return res.status(404).json({ message: 'No webinars found' })
    // }
    res.status(200).json(webinars || null) 
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching webinars' })
  }
}

exports.upcomingWebinars = async (req, res) => {
  try {
    const webinars = await Webinar.find({status: 'upcoming'}).sort({createdAt: -1}).populate('attendees', 'name email avatar')
    // if (!webinars || webinars.length === 0) {
    //   return res.status(404).json({ message: 'No upcoming webinars found' })
    // }
    res.status(200).json(webinars || null)
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching upcoming webinars' })
  }
}

exports.pastWebinars = async (req, res) => {
  try {
    const webinars = await Webinar.find({status: 'past'})
    // if (!webinars || webinars.length === 0) {
    //   return res.status(404).json({ message: 'No past webinars found' })
    // }
    res.status(200).json(webinars || null)
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching past webinars' })
  }
}

exports.registerWebinar = async (req, res) => {
  try {
    const { webinarid, userid } = req.params
    const tokenUserId = req.user.id

    if (userid !== tokenUserId) {
      return res.status(403).json({ message: "Can't validate user" })
    }

    const webinar = await Webinar.findById(webinarid)
    const user = await User.findById(userid)

    if (!user) return res.status(400).json({ message: 'Please login first' })
    if (!webinar) return res.status(400).json({ message: 'Webinar not found' })

    // Paid webinar: verify payment
    if (!webinar.isFree) {
      const payment = await PaymentTransaction.findOne({
        user_id: userid,
        'item.item_type': 'webinar',
        'item.item_id': webinarid,
        status: 'success'
      })

      if (!payment) {
        return res.status(400).json({
          message: 'Payment not completed for this webinar. Please complete payment first.'
        })
      }
    }

    // Generate unique token for registration
    let registrationToken
    do {
      registrationToken = uuidv4()
    } while (webinar.attendees?.some(att => att.token === registrationToken))

    // Atomic update: prevent duplicate registration and overbooking
    const updatedWebinar = await Webinar.findOneAndUpdate(
      {
        _id: webinarid,
        'attendees.user': { $ne: userid }, // not already registered
        $or: [{ seatCapacity: { $exists: false } }, { $expr: { $lt: [{ $size: "$attendees" }, "$seatCapacity"] } }]
      },
      {
        $push: { attendees: { user: userid, token: registrationToken, used: false } }
      },
      { new: true }
    ).populate('attendees.user', 'name email')

    if (!updatedWebinar) {
      return res.status(400).json({ message: 'Already registered or seats full.' })
    }

    // Generate QR code
    const qrDataUrl = await QRCode.toDataURL(registrationToken)
    const qrBuffer = await QRCode.toBuffer(registrationToken)

    // Upload QR code to Cloudinary
    const uploaded = await cloudinary.uploader.upload(qrDataUrl, { folder: 'webinar_qrcodes' })

    // Send email with QR
    const emailContent = webinarEmailTemplate(user, webinar, uploaded.secure_url)

    await sendEmailWithAttachment(
      user.email,
      `Registered for ${webinar.title}`,
      emailContent,
      [{ filename: 'qrcode.png', content: qrBuffer, cid: 'qrcode@webinar' }]
    )

    return res.status(200).json({
      success: true,
      message: `User successfully registered for the ${webinar.isFree ? 'free' : 'paid'} webinar`,
      data: updatedWebinar
    })
  } catch (error) {
    console.error('Error in webinar registration:', error)
    res.status(500).json({
      success: false,
      message: 'User registration failed for the webinar',
    })
  }
}

exports.unregisterWebinar = async (req, res) => {
  try {
    const { webinarid, userid } = req.params

    const webinar = await Webinar.findById(webinarid)
    const user = await User.findById(userid)

    if (!user) {
      return res.status(400).json({ message: 'Please login first' })
    }
    if (!webinar) {
      return res.status(400).json({ message: 'Webinar not found' })
    }

    if (!webinar.attendees.includes(userid)) {
      return res.status(400).json({ message: 'User is not registered for this webinar.' })
    }

    const updatedWebinar = await Webinar.findByIdAndUpdate(
      webinarid,
      { $pull: { attendees: userid } },
      { new: true }
    ).populate('attendees', 'name email')

    const text = `Hi ${user.name},
You have successfully unregistered from "${webinar.title}" scheduled on ${new Date(webinar.webinarDate).toDateString()}.
We are sorry to miss you, hope to see you in our future webinars!
– ISA`

    await sendEmail(user.email, `Unregistered from ${webinar.title}`, text)

    res.status(200).json({
      success: true,
      message: 'User successfully unregistered from the webinar',
      data: updatedWebinar
    })
  } catch (error) {
    console.error('Error in unregistration:', error)
    res.status(500).json({
      success: false,
      message: 'User unregistration failed for the event'
    })
  }
}

exports.updatedWebinar = async (req, res) => {
  const { id } = req.params
  const updates = { ...req.body }

  try {
    const oldWebinar = await Webinar.findById(id)
    if (!oldWebinar) {
      return res.status(404).json({ message: 'Webinar not found' })
    }

    if (typeof updates.isFree !== 'undefined') {
      if (updates.isFree === true) {
        updates.fee = undefined
      } else if (updates.isFree === false) {
        if (!updates.fee || updates.fee <= 0) {
          return res.status(400).json({
            message: 'Fee must be provided for paid webinars and greater than 0',
          })
        }
      }
    }

    if (req.file && oldWebinar.thumbnailPublicId) {
      await cloudinary.uploader.destroy(oldWebinar.thumbnailPublicId)
    }

    if (updates.videoLink && updates.videoLink !== oldWebinar.videoLink) {
      updates.oldVideoLink = oldWebinar.videoLink
    }

    const webinar = await Webinar.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })

    res.status(200).json(webinar)
  } catch (error) {
    res.status(500).json({ message: 'Error updating webinar', error: error.message })
  }
}

exports.deleteWebinar = async (req, res) => {
  const { id } = req.params
  try {
    const webinar = await Webinar.findById(id)
    if (webinar.publicId) {
      await cloudinary.uploader.destroy(webinar.publicId, {
        resource_type: 'image'
      })
    }
    await Webinar.findByIdAndDelete(id)
    if (!webinar) return res.status(404).json({ message: 'webinar not found' })
    res.status(200).json({ message: 'webinar deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Error deleting webinar', error: err.message })
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
    const getFeatured = await Webinar.findOne({ featured: true });

    // Return null if none found
    res.status(200).json(getFeatured || null);
  } catch (error) {
    res.status(500).json({ message: 'Server error in getFeatured', error: error.message });
  }
};

exports.removeFeatured = async (req, res) => {
  try {
    const { id } = req.params
    await Webinar.findByIdAndUpdate(id, { featured: false })
    res.status(200).json({ message: 'Webinar removed from featured.' })
  } catch (error) {
    res.status(500).json({
      message: 'Error removing webinar as featured!',
      error: error.message
    })
  }
}