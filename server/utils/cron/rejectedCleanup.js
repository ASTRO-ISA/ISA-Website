const cron = require('node-cron')
const Event = require('../../models/eventModel')
const BlogSuggestion = require('../../models/blogSuggestion')
const Blog = require('../../models/blogModel')
const cloudinary = require('cloudinary').v2

cron.schedule('0 0 * * *', async () => {
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
          console.error(`Failed to delete blog thubnail ${blog.publicId}:`, err)
        }
      }
    }

    await Blog.deleteMany({ status: 'rejected', statusChangedAt: { $lt: cutoffDate } })
    console.log('Blogs cleanup done')
  } catch (err) {
    console.error('Blog cleanup failed:', err)
  }
})