const mongoose = require('mongoose')

const webinarSchema = new mongoose.Schema({
    thumbnail: {
        type: String,
        required: [true, 'Thumbnail is required.']
    },
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        maxLength: [180, 'Only 180 characters are allowed in description.']
    },
    presenter: {
        type: String,
        required: [true, 'Please provide the presenter name.']
    },
    webinarDate: {
        type: Date,
        required: [true, 'Please provide a valid date.']
    },
    type: {
        type: String,
        required: true,
    },
    videoId: {
        type: String,
        required: [true, 'Provide a video ID']
    },
    attendees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    featured: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    publicId: {
        type: String,
        required: [true, 'could not find the pulic id to save the image o cloudinary']
    }
})

const Webinar = mongoose.model('Webinar', webinarSchema)

module.exports = Webinar