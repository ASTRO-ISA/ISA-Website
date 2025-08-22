const Course = require('../models/coursesModel')
const cloudinary = require('cloudinary').v2

const createCourse = async (req, res) => {
  try {
    const { title, description, source, applyLink } = req.body

    if (!req.file || !title || !description || !source || !applyLink) {
      return res.status(400).json({ message: 'Required fields are missing.' })
    }

    const imageUrl = req.file.path
    const publicId = req.file.filename

    const newCourse = new Course({
      title,
      description,
      source,
      applyLink,
      imageUrl,
      publicId
    })

    const savedCourse = await newCourse.save()

    res.status(201).json({
      message: 'Course created successfully',
      course: savedCourse
    })
  } catch (error) {
    console.error('Error creating course:', error.message)
    res.status(500).json({ message: 'Server error while creating course.' })
  }
}

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({})
    res.status(200).json(courses)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching courses', details: err.message })
  }
}

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params
    const course = await Course.findById(id)
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    await cloudinary.uploader.destroy(course.publicId)
    await course.deleteOne()

    res.status(200).json({ message: 'Course deleted successfully' })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error deleting course', details: err.message })
  }
}

module.exports = {
  createCourse,
  getAllCourses,
  deleteCourse
}
