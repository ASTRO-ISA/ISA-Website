const cron = require('node-cron')
const Event = require('../../models/eventModel')
const BlogSuggestion = require('../../models/blogSuggestion')
const Blog = require('../../models/blogModel')
const ResearchPaper = require('../../models/researchPaperModel')
const cloudinary = require('cloudinary').v2

cron.schedule('0 2 * * *', async () => {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - 2)

  try {
    const rejectedEvents = await Event.find({
      status: 'rejected',
      statusChangedAt: { $lt: cutoffDate },
    })

    for (let event of rejectedEvents) {
      if (event.thumbnail && event.publicId) {
        try {
          await cloudinary.uploader.destroy(event.publicId)
          console.log(`Deleted event banner: ${event.publicId}`)
        } catch (err) {
          console.error(`Failed to delete event banner ${event.publicId}:`, err)
        }
      }
    }

    await Event.deleteMany({ status: 'rejected', statusChangedAt: { $lt: cutoffDate } })
    console.log('Events cleanup done')
  } catch (err) {
    console.error('Event cleanup failed:', err)
  }

  try {
    await BlogSuggestion.deleteMany({ status: 'rejected', statusChangedAt: { $lt: cutoffDate } })
    console.log('BlogSuggestions cleanup done')
  } catch (err) {
    console.error('BlogSuggestions cleanup failed:', err)
  }

  try {
    const rejectedBlogs = await Blog.find({
      status: 'rejected',
      statusChangedAt: { $lt: cutoffDate },
    })

    for (let blog of rejectedBlogs) {
      if (blog.thumbnail && blog.publicId) {
        try {
          await cloudinary.uploader.destroy(blog.publicId)
          console.log(`Deleted blog thumbnail: ${blog.publicId}`)
        } catch (err) {
          console.error(`Failed to delete blog thumbnail ${blog.publicId}:`, err)
        }
      }
    }

    await Blog.deleteMany({ status: 'rejected', statusChangedAt: { $lt: cutoffDate } })
    console.log('Blogs cleanup done')
  } catch (err) {
    console.error('Blog cleanup failed:', err)
  }

  try {
    const rejectedPapers = await ResearchPaper.find({
      status: 'rejected',
      statusChangedAt: { $lt: cutoffDate },
    })

    for (let paper of rejectedPapers) {
      if (paper.paperUrl && paper.paperPublicId) {
        try {
          await cloudinary.uploader.destroy(paper.paperPublicId)
          console.log(`Deleted research paper document: ${paper.paperPublicId}`)
        } catch (err) {
          console.error(`Failed to delete research paper document ${paper.paperPublicId}:`, err)
        }
      }
    }

    await ResearchPaper.deleteMany({ status: 'rejected', statusChangedAt: { $lt: cutoffDate } })
    console.log('Research papers cleanup done')
  } catch (err) {
    console.error('Research paper cleanup failed:', err)
  }
})