const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  thumbnail: {
    type: String
  },
  title: {
    type: String,
    required: [true, 'Please provide a title']
  },
  description: {
    type: String,
    minLength: [100, 'Write at least 100 characters']
  },
  eventDate: {
    type: Date,
    required: [true, 'You need to specify the event date']
  },
  location: {
    type: String,
    required: [true, 'Provide accurate location']
  },
  attendeeCount: {
    type: Number,
    default: 0
  },
  eventType: {
    type: String,
    required: [true, 'Specify if the event is virtual or In-person']
  },
  hostedBy: [
    // since multiple people can be host so using array to store multiple hosts
    {
      name: String
    }
  ],
  presentedBy: {
    type: String
  },
  type: {
    type: String,
    lowercase: true,
    enum: ['community', 'astronomical'],
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed'],
    required: true
  },
  registeredUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
