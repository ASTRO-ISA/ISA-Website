const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    instructor: { type: String, required: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    duration: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    students: { type: Number, default: 0 },
    price: { type: String, required: true },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
