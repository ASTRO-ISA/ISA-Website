const JobPost = require('../models/jobPostModel')
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

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
      return res.status(400).json({ status: 'fail', message: 'No ID provided in jobUpdater' })
    }

    // checking if the job exist
    const job = await JobPost.findById(id)
    if(!job){
      return res.status(404).json({ message: 'Job does not exist' })
    }

    // to check if the new request have something in it
    if((!req.body || Object.keys(req.body).length === 0) && !req.file){
      return res.status(400).json({
        status: 'fail',
        message: 'No data or document provided to update'
      })
    }

    // if new document is uploaded, handle upload to cloudinary
    if(req.file){
      const fileBuffer = req.file.buffer;

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw' // for PDF and other non-image files
          },
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        );

        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
      });

      // set new cloudinary info in req.body
      req.body.documentUrl = result.secure_url;
      req.body.documentPublicId = result.public_id;

      // delete old document from cloudinary
      if (job.documentPublicId) {
        await cloudinary.uploader.destroy(job.documentPublicId, {
          resource_type: 'raw'
        });
      }
    }

    // update the job post in MongoDB
    const updatedJob = await JobPost.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(200).json({
      status: 'success, job updated',
      data: updatedJob
    })
    } catch (error) {
      res.status(500).json({
        status: 'fail',
        message: 'server error, can not update job',
        error: error.message
      })
    }
}
