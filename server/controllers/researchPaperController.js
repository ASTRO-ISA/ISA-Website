const ResearchPaper = require('../models/researchPaperModel')
const cloudinary = require('cloudinary').v2
const { sendEmail } = require('../utils/sendEmail')
const { default: slugify } = require('slugify')

exports.pendingPapers = async (req, res) => {
  try {
    const response = await ResearchPaper.find({status: 'pending'}).populate(
      'uploadedBy',
      'name email'
    )
    res.status(200).json({ status: 'success', data: response })
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message })
  }
}

exports.approvedPapers = async (req, res) => {
  try{
    const papers = await ResearchPaper.find({status: 'approved'}).sort({createdAt: -1}).populate(
      'uploadedBy',
      'name email'
    )
    if(!papers){
      return res.status(404).json({message: 'Papers not found'})
    }
    res.status(200).json(papers)
  } catch (err) {
    res.status(500).json({status: 'fail', error: err.message})
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

    const slug = slugify(title, {
      lower: true,
      strict: true
    })

    const newPaper = await ResearchPaper.create({
      title,
      slug,
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
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'No ID provided in updatePaper' });
    }

    const oldPaper = await ResearchPaper.findById(id);
    if (!oldPaper) {
      return res.status(404).json({ message: 'Paper does not exist' });
    }

    if ((!req.body || Object.keys(req.body).length === 0) && !req.file) {
      return res.status(400).json({
        status: 'fail',
        message: 'No data or document provided to update'
      });
    }

    const slug = slugify(req.body.title, {
      lower: true,
      strict: true
    })

    const updateData = {
      title: req.body.title ?? oldPaper.title,
      title: slug ?? oldPaper.slug,
      authors: req.body.authors ?? oldPaper.authors,
      abstract: req.body.abstract ?? oldPaper.abstract,
      publishedOn: req.body.publishedOn ?? oldPaper.publishedOn,
    };

    if (req.file) {
      updateData.paperUrl = req.file.path;
      updateData.paperPublicId = req.file.filename;

      if (oldPaper.paperPublicId) {
        await cloudinary.uploader.destroy(oldPaper.paperPublicId, {
          resource_type: 'raw'
        });
      }
    } else {
      updateData.paperUrl = oldPaper.paperUrl;
      updateData.paperPublicId = oldPaper.paperPublicId;
    }

    const updatedPaper = await ResearchPaper.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      message: 'Paper updated',
      data: updatedPaper
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Server error, cannot update paper',
      error: error.message
    });
  }
};

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

exports.changeStatus = async (req, res) => {
  try{
    const { id } = req.params
    const status = req.body.status
    const paper = await ResearchPaper.findByIdAndUpdate(id, {status: status}, {new: true, runValidators: true}).populate('uploadedBy', 'name email')
    if(!paper){
      return res.status(404).json({message: 'Paper not found'})
    }

    if (status === 'approved') {
      const text = `
        <p>Hello ${paper.uploadedBy.name},</p>

        <p>Congratulations! Your research paper 
        <strong>'${paper.title}'</strong> has been 
        <span style='color:green;font-weight:bold;'>approved</span> and is now published on ISA.</p>

        <p>You can view your paper here:  
        <a href='${process.env.CLIENT_URL}/research-papers/${paper.id}' target='_blank'>Read Paper</a></p>

        <p>Thank you for your valuable academic contribution. We’re excited to share your research with the ISA community.</p>

        <p>Best regards,<br>
        Team ISA</p>
      `;
      await sendEmail(paper.uploadedBy.email, `Your research paper '${paper.title}' is now live!`, text)
    }

    if (status === 'rejected') {
      const text = `
        <p>Hello ${paper.createdBy.name},</p>

        <p>We regret to inform you that your research paper 
        <strong>'${paper.title}'</strong> has been 
        <span style='color:red;font-weight:bold;'>rejected</span> after review.</p>

        <p><strong>Reason from Admin:</strong></p>
        <blockquote style='border-left: 3px solid #ccc; margin: 10px 0; padding-left: 10px; color:#555;'>
          ${paper.adminComment || 'No specific reason provided.'}
        </blockquote>

        <p>You may revise and resubmit your research paper if you’d like to address the feedback provided.</p>

        <p>We truly appreciate your effort and encourage you to continue contributing your research to the ISA platform.</p>

        <p>Best regards,<br>
        Team ISA</p>
      `
      await sendEmail(paper.createdBy.email, `Update on your research paper: ${paper.title}`, text)
    }
    res.status(200).json({message: 'Status changes sunccessfully.'})
  } catch (err) {
    res.status(500).json({message: 'Server error', error: err.message})
  }
}

exports.userPapers = async (req, res) => {
  try{
    const { userId } = req.params
    const papers = await ResearchPaper.find({createdBy: userId}).sort({createdAt: -1})
    if(!papers){
      return res.status(404).json({message: 'No research papers written by the user.'})
    }
    res.status(200).json(papers)
  } catch (err) {
    res.status(500).json({message: 'Server error finding user papers.', error: err.message})
  }
}