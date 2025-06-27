const mongoose = require('mongoose')

const blogSuggestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    default: 'No description provided'
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  response: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const BlogSuggestion = mongoose.model('BlogSuggestion', blogSuggestionSchema)
module.exports = BlogSuggestion
