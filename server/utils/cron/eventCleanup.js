const cron = require('node-cron')
const Event = require('../../models/eventModel')
const cloudinary = require('cloudinary').v2

cron.schedule('10 1 * * *', async () => {
  try {
    // only deleting events which have ended one day ago so current time - 24
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    const expiredEvents = await Event.find({ eventEndTime: { $lt: oneDayAgo } })

    for (const event of expiredEvents) {
      if (event.publicId) {
        await cloudinary.uploader.destroy(event.publicId)
      }
      await event.deleteOne();
      console.log(`Deleted completed event: ${event.title}`)
    }
  } catch (err) {
    console.error('Error deleting completed events:', err.message)
  }
})