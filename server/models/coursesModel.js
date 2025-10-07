const mongoose = require("mongoose");
const validator = require("validator");

const courseSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true, trim: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    applyLink: {
      type: String,
      required: true,
      validate: [validator.isURL, 'Please enter a valid URL'],
    },
    imageUrl: { 
      type: String, 
      required: true 
    },
    publicId: { 
      type: String, 
      required: true 
    },
    source: {
      type: String,
      required: true,
    },
    isFree: {
      type: Boolean,
      default: false
    },
    fee: {
      type: Number,
      min: [0, 'Fee cannot be negative'],
      validate: {
        validator: function (value) {
          if (!this.isFree && (!value || value <= 0)) {
            return false
          }
          return true
        },
        message: 'Paid courses must have a valid fee greater than 0'
      }
    }
  },
  { timestamps: true }
)

const Course = mongoose.model('Course', courseSchema)
module.exports = Course
