const mongoose = require('mongoose')

const webinarSchema = new mongoose.Schema({
    thumbnail: {
        type: String,
        required: [true, 'Thumbnail is required.']
    },
    publicId: {
        type: String,
        required: [true, 'Provide a publicId']
    },
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    slug: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        maxLength: [180, 'Only 180 characters are allowed in description.']
    },
    presenter: {
        type: String,
        required: [true, 'Please provide the presenter name.']
    },
    guests: [
        {
            type: String
        }
    ],
    webinarDate: {
        type: Date,
        required: [true, 'Please provide a valid date.']
    },
    videoId: {
        type: String,
        required: [true, 'Provide a videoId']
    },
    attendees: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
          token: { type: String, required: true },
          used: { type: Boolean, default: false }
        }
    ],
    featured: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['upcoming', 'past'],
        default: 'upcoming'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isFree: {
        type: Boolean,
        default: false
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
          message: 'Paid webinar must have a valid fee greater than 0'
        }
    }
})

// if somehow we missed setting slug
webinarSchema.pre('validate', function(next){
    if(this.title && !this.slug){
        this.slug = slugify(this.title, {
            lower: true,
            strict: true
        })
    }
    next()
})

const Webinar = mongoose.model('Webinar', webinarSchema)

module.exports = Webinar