const cron = require('node-cron')
const Webinar = require('../../models/webinarModel')
const Event = require('../../models/eventModel')

// once a day
cron.schedule('0 9 * * *', async () => {
  const now = new Date()

  try {
    // update webinars
    await Webinar.updateMany(
      {
        webinarDate: { $lte: new Date(now.getTime() - 2 * 60 * 60 * 1000) }, // 2 hours after webinarDate
        status: 'upcoming'
      },
      { $set: { status: 'past' } }
    )

    // update events
    const events = await Event.find({ status: 'upcoming' })

    for (let event of events) {
      // combine eventDate + eventEndTime (string like '18:30')
      const [hours, minutes] = event.eventEndTime.split(':').map(Number)
      const eventEnd = new Date(event.eventDate)
      eventEnd.setHours(hours, minutes, 0, 0)

      if (now > eventEnd) {
        event.status = 'completed'
        await event.save()
      }
    }
  } catch (err) {
    console.error('Error in scheduler while changing webinar and event status:', err)
  }
})