const mongoose = require('mongoose')

const featuredSchema = new mongoose.Schema({
    caption: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    publicId: {
        type: String,
    },
    socialLink: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const Featured = mongoose.model('Featured', featuredSchema)

module.exports = Featured