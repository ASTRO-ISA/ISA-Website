const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String, // it will contain video URL
        default: '../media/blogThumbnail.webp'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = blogSchema;