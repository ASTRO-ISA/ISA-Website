const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    thumbnail: {
        type: String,
    },
    title: {
        type: String,
        required: [true, 'Title is required.']
    },
    slug: {
        type: String,
        unique: true,
        required: true
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
    },
    status: {
        type: String,
        enum: ['approved', 'rejected', 'pending'],
        default: 'pending'
    },
    statusChangedAt: { // to save the timestamp when it's status got changed
        type: Date,
        default: Date.now
    },
    adminComment: {
        type: String,
        default: 'No specific reason provide.'
    }
})

blogSchema.pre('validate', function(next){
    if(this.title && !this.slug){
        this.slug = slugify(this.title, {
            lower: true,
            strict: true
        })
    }
    next()
})
const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
