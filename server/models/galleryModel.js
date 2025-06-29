const mongoose = require('mongoose')

const gallerySchema = new mongoose.Schema({
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
    }
})

const Gallery = mongoose.model('Gallery', gallerySchema)

module.exports = Gallery