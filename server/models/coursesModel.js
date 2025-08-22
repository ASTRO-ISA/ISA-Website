const mongoose = require("mongoose");
const validator = require("validator");

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    applyLink: {
      type: String,
      required: true,
      validate: [validator.isURL, 'Please enter a valid URL'],
    },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    source: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
