const mongoose = require('mongoose');

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
    type: String, enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  statusChangedAt: {
    type: Date,
    default: Date.now
  },
  response: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now }
})

blogSuggestionSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.statusChangedAt = Date.now
  }
  next()
})

const BlogSuggestion = mongoose.model('BlogSuggestion', blogSuggestionSchema)

module.exports = BlogSuggestion