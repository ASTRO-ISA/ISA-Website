const mongoose = require('mongoose')
const validator = require('validator')

const jobPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  role: {
    type: String
  },
  applyLink: {
    type: String,
    validate: [validator.isURL, 'Please enter a valid URL']
  },
  documentUrl: {
    type: String,
  },
  documentPublicId: {
    type: String,
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const JobPost = mongoose.model('JobPost', jobPostSchema)
module.exports = JobPost
