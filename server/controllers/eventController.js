const Event = require('../models/eventModel')
const User = require('../models/userModel')
const { sendEmail } = require('../utils/sendEmail')
const cloudinary = require('cloudinary').v2

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

    const event = new Event({
      title,
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
  const { id } = req.params
  try {
    const event = await Event.findById(id).populate(
      'createdBy',
      '_id name email'
    )
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

exports.updateEvent = async (req, res) => {
  const { id } = req.params
  const updates = req.body

  try {
    const event = await Event.findByIdAndUpdate(id, updates, { new: true })
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
      res.status(404).json({message: 'Event not found.'})
    }

    if(status === 'approved'){
    // sending confirmation email
    const text = `Its live ${event.createdBy.name},
    The event named "${event.title}" on ${new Date(event.eventDate).toDateString()} at ${event.location} is now listed. Share link with your friends to register.
    Thank you for using our platform!
    – ISA`

    await sendEmail(event.createdBy.email, event.title, text)
    }

    res.status(200).json({message: 'Status changes successfully'})
  } catch (err) {
    res.status(500).json({message: 'Server error changing event status'})
  }
}