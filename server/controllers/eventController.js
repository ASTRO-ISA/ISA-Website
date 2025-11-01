const { default: slugify } = require('slugify')
const Event = require('../models/eventModel')
const User = require('../models/userModel')
const { sendEmail, sendEmailWithAttachment } = require('../utils/sendEmail')
const cloudinary = require('cloudinary').v2
require('dotenv').config()
const { v4: uuidv4 } = require('uuid')
const QRCode = require('qrcode')
const PaymentTransaction = require('../models/transactionsModel')

exports.createEvent = async (req, res) => {
  try {
    let {
      title,
      description,
      eventDate,
      location,
      eventType,
      presentedBy,
      type,
      status,
      isFree,
      fee,
      seatCapacity
    } = req.body

    isFree = isFree === 'true' || isFree === true
    if (!isFree) {
      fee = Number(fee)
      if (isNaN(fee) || fee <= 0) {
        return res.status(400).json({ error: 'Fee must be a valid number' })
      }
    } else {
      fee = null
    }

    // validate seat capacity
    seatCapacity = Number(seatCapacity)
    if (isNaN(seatCapacity) || seatCapacity <= 0) {
      return res
        .status(400)
        .json({ error: 'Seat capacity must be a positive number' })
    }

    // handle end time (default = +24h)
    const eventEndTime = req.body.eventEndTime
      ? new Date(req.body.eventEndTime)
      : new Date(Date.now() + 24 * 60 * 60 * 1000)

    // parse hosts (array of objects)
    const hostedBy = JSON.parse(req.body.hostedBy || '[]')

    // handle file uploads
    const thumbnail = req.file ? req.file.path : ''
    const publicId = req.file ? req.file.filename : ''
    const createdBy = req.user.id

    // slug for clean URLs
    const slug = slugify(title, {
      lower: true,
      strict: true
    })

    // prepare event data
    const eventData = {
      title,
      slug,
      description,
      eventDate,
      eventEndTime,
      location,
      eventType,
      presentedBy,
      type,
      status,
      hostedBy,
      thumbnail,
      publicId,
      createdBy,
      isFree,
      fee,
      seatCapacity,
      attendeeCount: 0
    }

    const event = new Event(eventData)
    await event.save()

    res.status(201).json({ message: 'Event created successfully', event })
  } catch (error) {
    console.error('Event creation error:', error)
    res.status(500).json({ error: 'Failed to create event' })
  }
}

exports.Events = async (req, res) => {
  try {
    const events = await Event.find({}).populate(
      'registeredUsers',
      'avatar name email'
    )
    if (!events) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.status(200).json(events)
  } catch (err) {
    res.status(500).json({ message: 'Server error in get events' })
  }
}

exports.pendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ statusAR: 'pending' }).populate(
      'registeredUsers',
      'avatar name email'
    )
    if (!events) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.status(200).json(events)
  } catch (err) {
    res.status(500).json({ message: 'Server error in get events' })
  }
}

exports.approvedEvents = async (req, res) => {
  try {
    const events = await Event.find({ statusAR: 'approved' })
      .sort({ createdAt: -1 })
      .populate('registeredUsers', 'avatar name email')
    if (!events) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.status(200).json(events)
  } catch (err) {
    res.status(500).json({ message: 'Server error in get events' })
  }
}

exports.upcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({
      statusAR: 'approved',
      status: 'upcoming'
    })
      .sort({ createdAt: -1 })
      .populate('registeredUsers', 'avatar name email')
    if (!events) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.status(200).json(events)
  } catch (err) {
    res.status(500).json({ message: 'Server error in get events' })
  }
}

exports.getEvent = async (req, res) => {
  const { slug } = req.params
  try {
    const event = await Event.findOne({ slug }).populate([
      {
        path: 'createdBy',
        select: '_id name email'
      },
      {
        path: 'registeredUsers',
        select: '_id name email'
      }
    ])
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.status(200).json(event)
  } catch (err) {
    res.status(500).json({ message: 'Server error in getEvent' })
  }
}

exports.registerEvent = async (req, res) => {
  try {
    const { eventid, userid } = req.params
    const tokenUserId = req.user.id

    // user validation
    if (userid !== tokenUserId) {
      return res.status(403).json({ message: "Can't validate user" })
    }

    const event = await Event.findById(eventid)
    const user = await User.findById(userid)

    if (!user) return res.status(400).json({ message: 'Please login first' })
    if (!event) return res.status(400).json({ message: 'Event not found' })

    // check if registration are open
    if (!event.isRegistrationOpen) {
      return res.status(400).json({ message: 'Registration for this event is currently closed.' })
    }

    // for paid events — verify payment
    if (!event.isFree) {
      const payment = await PaymentTransaction.findOne({
        user_id: userid,
        'item.item_type': 'event',
        'item.item_id': eventid,
        status: 'success'
      })

      if (!payment) {
        return res.status(400).json({
          message: 'Payment not completed for this event. Please complete payment first.'
        })
      }
    }

    // generate unique token
    let registrationToken
    do {
      registrationToken = uuidv4()
    } while (event.registeredUsers?.some((r) => r.token === registrationToken))

    // prevent duplicates + overbooking
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: eventid,
        'registeredUsers.user': { $ne: userid }, // not already registered
        $or: [
          { seatCapacity: { $exists: false } },
          { $expr: { $lt: [{ $size: '$registeredUsers' }, '$seatCapacity'] } }
        ]
      },
      {
        $push: {
          registeredUsers: { user: userid, token: registrationToken, used: false }
        }
      },
      { new: true }
    ).populate('registeredUsers.user', 'name email')

    if (!updatedEvent) {
      return res.status(400).json({ message: 'Already registered or seats full.' })
    }

    // generate QR code
    const qrDataUrl = await QRCode.toDataURL(registrationToken)
    const qrBuffer = await QRCode.toBuffer(registrationToken)

    // upload QR code to Cloudinary
    const uploaded = await cloudinary.uploader.upload(qrDataUrl, {
      folder: 'event_qrcodes'
    })

    // email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; line-height:1.5;">
        <h3>Event Registration Confirmed</h3>
        <p>Hi ${user.name},</p>
        <p>
          You have successfully registered for 
          <b>"${event.title}"</b> on 
          <b>${new Date(event.eventDate).toDateString()}</b> 
          at <b>${event.location}</b>.
        </p>
        <p style="background:#f9f9f9; padding:12px; border-left:4px solid #4F46E5; margin:20px 0;">
          <strong>Important:</strong> Please save the attached QR code for entry at the venue.
        </p>
        <p style="text-align:center;">
          <img src="${uploaded.secure_url}" alt="QR Code" style="max-width:200px;"/>
        </p>
        <p>– ISA</p>
      </div>
    `

    // send email with QR
    await sendEmailWithAttachment(
      user.email,
      `Registered for ${event.title}`,
      emailContent,
      [
        {
          filename: 'qrcode.png',
          content: qrBuffer,
          cid: 'qrcode@event'
        }
      ]
    )

    return res.status(200).json({
      success: true,
      message: `User successfully registered for the ${event.isFree ? 'free' : 'paid'} event`,
      data: updatedEvent
    })
  } catch (error) {
    console.error('Error in event registration:', error)
    res.status(500).json({
      success: false,
      message: 'User registration failed for the event'
    })
  }
}

exports.unregisterEvent = async (req, res) => {
  try {
    const { eventid, userid } = req.params

    const event = await Event.findById(eventid)
    const user = await User.findById(userid)

    if (!user) {
      return res.status(400).json({ message: 'Please login first' })
    }
    if (!event) {
      return res.status(400).json({ message: 'Event not found' })
    }

    const regEntry = event.registeredUsers.find(
      (u) => u.user.toString() === userid
    )

    if (!regEntry) {
      return res
        .status(400)
        .json({ message: 'User is not registered for this event' })
    }

    // delete QR from cloudinary
    if (regEntry.token) {
      try {
        await cloudinary.uploader.destroy(regEntry.token) // token holds the Cloudinary public_id
      } catch (err) {
        console.error('Error deleting QR from Cloudinary:', err.message)
      }
    }

    // remove the registered user entry from event
    const updatedEvent = await Event.findByIdAndUpdate(
      eventid,
      { $pull: { registeredUsers: { user: userid } } },
      { new: true }
    ).populate('registeredUsers.user', 'name email')

    // send cancellation email
    const text = `Hi ${user.name},
    You have successfully unregistered from "${event.title}" scheduled on ${new Date(
      event.eventDate
    ).toDateString()} at ${event.location}.
    Hope to see you at our future events!
    – ISA`

    await sendEmail(user.email, `Unregistered from ${event.title}`, text)

    res.status(200).json({
      success: true,
      message: 'User successfully unregistered from the event',
      data: updatedEvent
    })
  } catch (error) {
    console.error('Error in unregistering:', error)
    res.status(500).json({
      success: false,
      message: 'User unregistration failed for the event'
    })
  }
}

exports.updateEvent = async (req, res) => {
  const { id } = req.params
  const updates = { ...req.body }

  try {
    // parse boolean
    if (updates.isFree !== undefined) {
      updates.isFree = updates.isFree === 'true'

      // when switching to free, overwrite fee to 0
      if (updates.isFree) {
        updates.fee = 0
      }
    }

    // convert fee to number if it's paid
    if (!updates.isFree && updates.fee !== undefined && updates.fee !== '') {
      updates.fee = Number(updates.fee)
    }

    // convert seatCapacity to number
    if (updates.seatCapacity !== undefined && updates.seatCapacity !== '') {
      updates.seatCapacity = Number(updates.seatCapacity)
    }

    // parse hostedBy JSON if provided
    if (updates.hostedBy) {
      try {
        updates.hostedBy = JSON.parse(updates.hostedBy)
      } catch (err) {
        return res.status(400).json({ message: 'Invalid hostedBy format' })
      }
    }

    // handle slug if title changed
    if (updates.title) {
      const baseSlug = slugify(updates.title, { lower: true, strict: true })
      let slug = baseSlug
      let counter = 1
      while (await Event.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter++}`
      }
      updates.slug = slug
    }

    // handle thumbnail file
    if (req.file) updates.thumbnail = req.file.filename

    // pdate event
    const event = await Event.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    })

    if (!event) return res.status(404).json({ message: 'Event not found' })

    res.status(200).json(event)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error updating event', error })
  }
}

exports.deleteEvent = async (req, res) => {
  const { id } = req.params
  try {
    const event = await Event.findById(id)
    if (!event) return res.status(404).json({ message: 'Event not found' })
    await cloudinary.uploader.destroy(event.publicId)
    await event.deleteOne()
    res.status(200).json({ message: 'Event deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error })
  }
}

exports.changeStatus = async (req, res) => {
  try {
    const { id } = req.params
    const status = req.body.status

    const event = await Event.findByIdAndUpdate(
      id,
      { statusAR: status },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' })
    }

    if (status === 'approved') {
      // sending confirmation email
      const text = `
    <p>Hello ${event.createdBy.name},</p>

    <p>Good news! 🎉 Your event <strong>"${event.title}"</strong> scheduled for 
    <strong>${new Date(event.eventDate).toDateString()}</strong> at 
    <strong>${event.location}</strong> has been approved and is now live on ISA.</p>

    <p>👉 Share your event link with others to start registrations:  
    <a href="${process.env.CLIENT_URL}/events/${event.slug}" target="_blank">View Event</a></p>

    <p>Thank you for choosing our platform to host your event—we’re excited to see it come to life!</p>

    <p>Best regards,<br>
    Team ISA</p>
    `
      await sendEmail(
        event.createdBy.email,
        `Your event ${event.title} is now live.`,
        text
      )
    }

    if (status === 'rejected') {
      // sending rejection email
      const text = `
      <p>Hello ${event.createdBy.name},</p>
    
      <p>We regret to inform you that your event <strong>"${event.title}"</strong>, 
      scheduled for <strong>${new Date(event.eventDate).toDateString()}</strong> at 
      <strong>${event.location}</strong>, has been <span style="color:red;font-weight:bold;">rejected</span> after review.</p>
    
      <p><strong>Reason from Admin:</strong></p>
      <blockquote style="border-left: 3px solid #ccc; margin: 10px 0; padding-left: 10px; color:#555;">
        ${event.adminComment || 'No specific reason provided.'}
      </blockquote>
    
      <p>If you believe this was a mistake, you may revise and resubmit your event for consideration.</p>
    
      <p>We appreciate your interest in sharing events with the ISA community and encourage you to keep contributing!</p>
    
      <p>Best regards,<br>
      Team ISA</p>
      `

      await sendEmail(
        event.createdBy.email,
        `Update on your event: ${event.title}`,
        text
      )
    }

    res.status(200).json({ message: 'Status changes successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error changing event status' })
  }
}

exports.registeredEvents = async (req, res) => {
  try {
    const { userid } = req.params
    const events = await Event.find({ 'registeredUsers.user': userid })
    if (events.length === 0) {
      return res.status(404).json({ message: 'No registerd events.' })
    }
    res.status(200).json(events)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Server error finding the registerede events.' })
  }
}

exports.toggleRegistration = async (req, res) => {
  try {
    const { id } = req.params

    // Find event by ID
    const event = await Event.findById(id)
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }

    // Toggle registration status
    event.isRegistrationOpen = !event.isRegistrationOpen

    // Save updated event
    await event.save()

    res.status(200).json({
      success: true,
      message: `Registration has been ${event.isRegistrationOpen ? 'opened' : 'closed'} successfully.`,
      isRegistrationOpen: event.isRegistrationOpen
    })
  } catch (error) {
    console.error('Error toggling registration:', error)
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}