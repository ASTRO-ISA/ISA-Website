const { default: slugify } = require('slugify')
const Event = require('../models/eventModel')
const User = require('../models/userModel')
const { sendEmail } = require('../utils/sendEmail')
const cloudinary = require('cloudinary').v2
require('dotenv').config()

// const currentDate = new Date()

exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      eventDate,
      location,
      eventType,
      presentedBy,
      type,
      status
    } = req.body

    // setting an event end time which will help us delete after the event ends
    // if user have not entered a end time then we will assume it to last 1 day
    const eventEndTime = req.body.eventEndTime
      ? new Date(req.body.eventEndTime)
      : new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h later

    // hostedBy is sent as JSON string from frontend because we can have multiple hosts
    const hostedBy = JSON.parse(req.body.hostedBy || '[]')

    const thumbnail = req.file ? req.file.path : ''
    const publicId = req.file.filename
    const createdBy = req.user.id
    const slug = slugify(title, {
      lower: true,
      strict: true
    })

    const event = new Event({
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
      createdBy
    })

    await event.save()

    res.status(201).json({ message: 'Event created successfully', event })
  } catch (error) {
    console.error('Event creation error:', error)
    res.status(500).json({ error: 'Failed to create event' })
  }
}

// instead of making separate api routes for them, we can import all and separate in the frontend
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
    console.log(err)

    res.status(500).json({ message: 'Server error in get events' })
  }
}

exports.pendingEvents = async (req, res) => {
  try {
    const events = await Event.find({statusAR: 'pending'}).populate(
      'registeredUsers',
      'avatar name email'
    )
    if (!events) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.status(200).json(events)
  } catch (err) {
    console.log(err)

    res.status(500).json({ message: 'Server error in get events' })
  }
}

exports.approvedEvents = async (req, res) => {
  try {
    const events = await Event.find({statusAR: 'approved'}).sort({createdAt: -1}).populate(
      'registeredUsers',
      'avatar name email'
    )
    if (!events) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.status(200).json(events)
  } catch (err) {
    console.log(err)

    res.status(500).json({ message: 'Server error in get events' })
  }
}

exports.getEvent = async (req, res) => {
  const { slug } = req.params
  try {
    const event = await Event.findOne({slug}).populate([{
      path: 'createdBy',
      select: '_id name email',
    },{
      path: 'registeredUsers',
      select: '_id name email'
    }])
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.status(200).json(event)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error in getEvent' })
  }
}

exports.registerEvent = async (req, res) => {
  try {
    const { eventid, userid } = req.params

    const event = await Event.findById(eventid)
    const user = await User.findById(userid)

    if (!user) {
      return res.status(400).json({ message: 'Please make login' })
    }
    if (!event) {
      return res.status(400).json({ message: 'Event not found' })
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventid,
      { $addToSet: { registeredUsers: userid } },
      { new: true }
    ).populate('registeredUsers', 'name email')

    // sending confirmation email
    const text = `Hi ${user.name},
    You have successfully registered for "${event.title}" on ${new Date(event.eventDate).toDateString()} at ${event.location}.
    See you there!
    – ISA`

    await sendEmail(user.email, `Registered for ${event.title}`, text)

    res.status(200).json({
      success: true,
      message: 'User successfully registered for the event',
      data: updatedEvent
    })
  } catch (error) {
    console.error('Error in registration:', error)
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

    const updatedEvent = await Event.findByIdAndUpdate(
      eventid,
      { $pull: { registeredUsers: userid } },
      { new: true }
    ).populate('registeredUsers', 'name email')

    // optional: send cancellation email
    const text = `Hi ${user.name},
    You have successfully unregistered from "${event.title}" scheduled on ${new Date(event.eventDate).toDateString()} at ${event.location}.
    Hope to see you at our future events!
    – ISA`

    await sendEmail(user.email, `Unregistered from ${event.title}`, text)

    res.status(200).json({
      success: true,
      message: 'User successfully unregistered from the event',
      data: updatedEvent,
    })
  } catch (error) {
    console.error('Error in unregistering:', error)
    res.status(500).json({
      success: false,
      message: 'User unregistration failed for the event',
    })
  }
}


exports.updateEvent = async (req, res) => {
  const { id } = req.params
  const updates = { ...req.body }

  try {
    if (updates.title) {
      const baseSlug = slugify(updates.title, { lower: true, strict: true })
      let slug = baseSlug
      let counter = 1

      while (await Event.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter++}`
      }

      updates.slug = slug
    }

    const event = await Event.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
    if (!event) return res.status(404).json({ message: 'Event not found' })

    res.status(200).json(event)
  } catch (error) {
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
  try{
    const { id } = req.params
    const status = req.body.status

    const event = await Event.findByIdAndUpdate(id, { statusAR: status }, {new: true, runValidators: true}).populate('createdBy', 'name email')
    if(!event) {
      return res.status(404).json({message: 'Event not found.'})
    }

    if(status === 'approved'){
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
    await sendEmail(event.createdBy.email, `Your event ${event.title} is now live.`, text)
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
        ${event.adminComment || "No specific reason provided."}
      </blockquote>
    
      <p>If you believe this was a mistake, you may revise and resubmit your event for consideration.</p>
    
      <p>We appreciate your interest in sharing events with the ISA community and encourage you to keep contributing!</p>
    
      <p>Best regards,<br>
      Team ISA</p>
      `;
    
      await sendEmail(event.createdBy.email, `Update on your event: ${event.title}`, text);
    }

    res.status(200).json({message: 'Status changes successfully'})
  } catch (err) {
    res.status(500).json({message: 'Server error changing event status'})
  }
}

exports.registeredEvents = async (req, res) => {
  try{
    const { userid } = req.params
    const events = await Event.find({registeredUsers: userid})
    if(events.length === 0){
      return res.status(404).json({message: 'No registerd events.'})
    }
    res.status(200).json(events)
  } catch (err) {
    res.status(500).json({message: 'Server error finding the registerede events.'})
  }
}