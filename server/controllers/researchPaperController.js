const ResearchPaper = require('../models/researchPaperModel')
const cloudinary = require('cloudinary').v2

exports.getAllPapers = async (req, res) => {
  try {
    const response = await ResearchPaper.find({}).populate(
      'uploadedBy',
      'name email'
    )
    res.status(200).json({ status: 'success', data: response })
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message })
  }
}

exports.uploadPaper = async (req, res) => {
  try {
    const { title, authors, abstract } = req.body
    const uploadedBy = req.user._id

    if (!title || !authors || !abstract || !uploadedBy) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'some or all data missing' })
    }

    if (!req.file.path || !req.file.filename) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'File path from cloudinary missing.' })
    }

    const newPaper = await ResearchPaper.create({
      title,
      authors,
      abstract,
      paperUrl: req.file.path,
      paperPublicId: req.file.filename,
      uploadedBy
    })

    res.status(201).json({
      status: 'success',
      data: newPaper
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ status: 'error', message: 'Upload failed' })
  }
}

exports.updatePaper = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'No ID provided in jobUpdater' })
    }

    const newPaper = await ResearchPaper.findById(id)
    if (!newPaper) {
      return res.status(404).json({ message: 'paper does not exist' })
    }

    if ((!req.body || Object.keys(req.body).length === 0) && !req.file) {
      return res.status(400).json({
        status: 'fail',
        message: 'No data or document provided to update'
      })
    }

    if (req.file) {
      req.body.paperUrl = req.file.path
      req.body.paperPublicId = req.file.filename

      if (newPaper.paperPublicId) {
        await cloudinary.uploader.destroy(newPaper.paperPublicId, {
          resource_type: 'raw'
        })
      }
    }

    const updatedPaper = await ResearchPaper.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      status: 'success',
      message: 'paper updated',
      data: updatedPaper
    })
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Server error, cannot update job',
      error: error.message
    })
  }
}

exports.deletePaper = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        status: 'fail',
        message: 'No paper ID provided'
      })
    }

    const paper = await ResearchPaper.findById(id)

    if (!paper) {
      return res.status(404).json({
        status: 'fail',
        message: 'Paper not found'
      })
    }

    if (paper.paperPublicId) {
      await cloudinary.uploader.destroy(paper.paperPublicId, {
        resource_type: 'raw'
      })
    }

    await ResearchPaper.findByIdAndDelete(id)

    res.status(200).json({
      status: 'success',
      message: 'Paper deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Server error, could not delete paper',
      error: error.message
    })
  }
}
