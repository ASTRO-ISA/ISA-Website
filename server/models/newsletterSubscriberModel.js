const mongoose = require('mongoose')

const newsletterSubscribersSchema = new mongoose.Schema({
    subscribers: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      subscribedAt: {
        type: Date,
        default: Date.now
      }
    }]
})

const NewsletterSubscribers = mongoose.model('NewsletterSubscriber', newsletterSubscribersSchema)

const newsletterDraftSchema = new mongoose.Schema({
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const NewsletterDraft = mongoose.model('NewsletterDraft', newsletterDraftSchema)

module.exports = { NewsletterSubscribers, NewsletterDraft }