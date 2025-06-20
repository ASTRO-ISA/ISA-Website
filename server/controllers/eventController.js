const Event = require('../models/eventModel')

const currentDate = new Date()

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
    } = req.body;

    // hostedBy is sent as JSON string from frontend
    const hostedBy = JSON.parse(req.body.hostedBy || '[]');

    const thumbnail = req.file ? req.file.path : '';

    const event = new Event({
      title,
      description,
      eventDate,
      location,
      eventType,
      presentedBy,
      type,
      status,
      hostedBy,
      thumbnail
    });

    await event.save();

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
}

// instead of making separate api routes for them, we can import all and separate in the frontend
exports.Events = async (req, res) => {
    try{
        const events = await Event.find({})
        if(!events) {
            return res.status(404).json({message: 'Event not found'})
        }
        res.status(200).json(events)
    } catch (err) {
        res.status(500).json({message: 'Server error in get events'})
    }
}

exports.getEvent = async (req, res) => {
    const {id} = req.params
    try{
        const event = await Event.findById(id)
        if(!event) {
            return res.status(404).json({message: 'Event not found'})
        }
        res.status(200).json(event)
    } catch (err) {
        res.status(500).json({message: 'Server error in getEvent'})
    }
}