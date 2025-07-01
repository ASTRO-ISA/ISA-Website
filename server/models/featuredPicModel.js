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
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: String,
    },
})

const Featured = mongoose.model('Featured', featuredSchema)

module.exports = Featured