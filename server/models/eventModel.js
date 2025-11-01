const mongoose = require('mongoose')
const slugify = require('slugify')

const eventSchema = new mongoose.Schema({
  thumbnail: {
    type: String
  },
  title: {
    type: String,
    required: [true, 'Please provide a title']
  },
  slug: {
    type: String,
    unique: true,
    required: true
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
  seatCapacity: {
    type: Number,
    default: 0,
  },
  eventType: {
    type: String,
    required: [true, 'Specify if the event is virtual or In-person']
  },
  hostedBy: [
    // since multiple people can be host so using array to store multiple hosts
    {
      name: String,
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
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      token: {
        type: String,
        required: true
      },
      used: {
        type: Boolean,
        default: false // mark true when scanned
      }
    }
  ],
  scanners: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  publicId: {
    type: String,
    required: true
  },
  eventEndTime: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  statusAR: {
    type: String,
    enum: ['approved', 'rejected', 'pending'],
    default: 'pending'
  },
  statusChangedAt: {
    type: Date,
    default: Date.now
  },
  adminComment: {
    type: String,
    default: 'No specific reason provided.'
  },
  isFree: {
    type: Boolean,
    default: false
  },
  isRegistrationOpen: {
    type: Boolean,
    default: true
  },
  fee: {
    type: Number,
    min: [0, 'Fee cannot be negative'],
    validate: {
      validator: function (value) {
        if (!this.isFree && (!value || value <= 0)) {
          return false
        }
        return true
      },
      message: 'Paid events must have a valid fee greater than 0'
    }
  }
})

eventSchema.index({ 'registeredUsers.token': 1 }, { unique: true, sparse: true })

eventSchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true
    })
  }
  next()
})

eventSchema.pre('save', function (next) {
  if (this.isModified('statusAR')) {
    this.statusChangedAt = Date.now
  }
  next()
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
