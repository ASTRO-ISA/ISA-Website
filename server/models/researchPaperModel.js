const mongoose = require('mongoose')

const researchPaperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Research paper title is required'],
      unique: true
    },
    authors: {
      type: String,
      required: [true, 'Publisher name is required']
    },
    publishedOn: {
      type: Date,
      default: Date.now
    },
    abstract: {
      type: String,
      required: [true, 'Paper abstract is required']
    },
    paperUrl: {
      type: String,
      required: [true, 'Paper URL is required']
    },
    paperPublicId: {
      type: String,
      required: [true, 'Paper public_id is required']
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
)

const ResearchPaper = mongoose.model('ResearchPaper', researchPaperSchema)
module.exports = ResearchPaper
