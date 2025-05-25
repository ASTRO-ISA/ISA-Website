const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required.']
    },
    content: {
        type: String,
        minLength: [300, 'At least 300 characters are required.'],
        required: [true]
    },
    thumbnail: {
        type: String,
        default: 'http://localhost:3000/uploads/blogThumbnail.webp'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: String,
    },
    description: {
        type: String,
        maxLength: [180, 'Max of 180 characters are allowed.']
    }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
