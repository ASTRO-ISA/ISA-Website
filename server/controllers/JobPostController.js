const JobPost = require('../models/jobPostModel')

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
    if (!req.body.title)
      return res
        .status(400)
        .json({ status: 'fail', message: 'No data provided' })

    const response = await JobPost.create(req.body)
    res.status(201).json({ status: 'success', data: response })
  } catch (error) {
    res
      .status(500)
      .json({ status: 'fail', message: 'Server Error', error: error.message })
  }
}

exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params
    await JobPost.findByIdAndDelete(id)
    res.status(204).json({ status: 'success', message: 'Job post Deleted' })
  } catch (error) {
    res
      .status(500)
      .json({ status: 'fail', message: 'Server Error', error: error.message })
  }
}

exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ status: 'fail', message: 'No ID provided' })
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'No data provided' })
    }

    const updatedJob = await JobPost.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })

    if (!updatedJob) {
      return res.status(404).json({ status: 'fail', message: 'Job not found' })
    }

    res.status(200).json({ status: 'success', data: updatedJob })
  } catch (error) {
    res
      .status(500)
      .json({ status: 'fail', message: 'Server Error', error: error.message })
  }
}
