const JobPost = require('../models/jobPostModel')
const cloudinary = require('cloudinary').v2

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await JobPost.find({})

    res.status(200).json({ status: 'success', data: jobs })
  } catch (error) {
    res
      .status(500)
      .json({ status: 'fail', message: 'Server Error', error: error.message })
  }
}

exports.createJob = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ status: 'fail', message: 'No data provided' })

    if (!req.file.path || !req.file.filename) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'File path from cloudinary missing.' })
    }
    const newJob = await JobPost.create({
      title: req.body.title,
      role: req.body.role,
      applyLink: req.body.applyLink,
      documentUrl: req.file.path,
      documentPublicId: req.file.filename,
      description: req.body.description
    })
    res.status(201).json({ status: 'success', data: newJob })
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Server Error in createJob',
      error: error.message
    })
  }
}

exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        status: 'fail',
        message: 'No job ID provided'
      })
    }

    const job = await JobPost.findById(id)

    if (!job) {
      return res.status(404).json({
        status: 'fail',
        message: 'Job not found'
      })
    }

    if (job.documentPublicId) {
      await cloudinary.uploader.destroy(job.documentPublicId, {
        resource_type: 'raw'
      })
    }

    await JobPost.findByIdAndDelete(id)

    res.status(200).json({
      status: 'success',
      message: 'Job deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Server error, could not delete job',
      error: error.message
    })
  }
}

exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'No ID provided in jobUpdater' })
    }

    const job = await JobPost.findById(id)
    if (!job) {
      return res.status(404).json({ message: 'Job does not exist' })
    }

    if ((!req.body || Object.keys(req.body).length === 0) && !req.file) {
      return res.status(400).json({
        status: 'fail',
        message: 'No data or document provided to update'
      })
    }

    // Only handle document if new one is uploaded
    if (req.file) {
      req.body.documentUrl = req.file.path
      req.body.documentPublicId = req.file.filename

      // Remove old doc from Cloudinary
      if (job.documentPublicId) {
        await cloudinary.uploader.destroy(job.documentPublicId, {
          resource_type: 'raw'
        })
      }
    }

    const updatedJob = await JobPost.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      status: 'success',
      message: 'Job updated',
      data: updatedJob
    })
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Server error, cannot update job',
      error: error.message
    })
  }
}
