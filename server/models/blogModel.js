const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    thumbnail: {
        type: String,
        // default: 'http://localhost:3000/uploads/blogThumbnail.webp'
    },
    title: {
        type: String,
        required: [true, 'Title is required.']
    },
    description: {
        type: String,
        maxLength: [180, 'Max of 180 characters are allowed.']
    },
    content: {
        type: String,
        minLength: [1000, 'At least 1000 characters are required.'],
        required: [true]
    },
    createdAt: {
        type: Date,
        default: Date.now // gives fresh timestamp to every blog when the blog is saved
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    featured: { // for the featured blog section
        type: Boolean,
        default: false
    },
    publicId: {
        type: String,
        required: true
    }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
