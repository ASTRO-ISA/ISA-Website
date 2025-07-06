const Course = require("../models/courses");

const createCourse = async (req, res) => {
  try {
    const {
      title,
      instructor,
      level,
      duration,
      rating,
      students,
      price,
    } = req.body;

    if (!req.file || !title || !instructor || !duration || !price) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    const imageUrl = req.file.path;       // Cloudinary URL
    const publicId = req.file.filename;   // Cloudinary public ID

    const newCourse = new Course({
      title,
      instructor,
      level,
      duration,
      rating,
      students,
      price,
      image: imageUrl,
      publicId,
    });

    const savedCourse = await newCourse.save();

    res.status(201).json({
      message: "Course created successfully",
      course: savedCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error.message);
    res.status(500).json({ message: "Server error while creating course." });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching courses" });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await cloudinary.uploader.destroy(course.publicId); // Remove image from Cloudinary
    await course.deleteOne();

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting course" });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  deleteCourse,
};
