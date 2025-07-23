const { NewsletterSubscribers, NewsletterDraft } = require('../models/newsletterSubscriberModel')
const nodemailer = require('nodemailer')
const { sendNewsletter } = require('../utils/sendEmail')

exports.subscribeToNewsletter = async (req, res) => {
  try {
    const userId = req.user.id

    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in request' })
    }

    let newsletter = await NewsletterSubscribers.findOne()
    if (!newsletter) {
      newsletter = new NewsletterSubscribers({ subscribers: [] })
    }

    newsletter.subscribers = newsletter.subscribers.filter(sub => sub.user)
    
    const alreadySubscribed = newsletter.subscribers.some(sub => {
      if (!sub.user) return false
      console.log("Checking subscriber", sub.user.toString())
      return sub.user.toString() === userId
    })

    if (alreadySubscribed) {
      return res.status(400).json({ message: 'User already subscribed' })
    }

    newsletter.subscribers.push({ user: userId })

    await newsletter.save()

    return res.status(200).json({ message: 'Successfully subscribed to newsletter' })

  } catch (err) {
    console.error('Error in subscribeToNewsletter', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.addToNewsletterDraft = async (req, res) => {
    try{
    const { type, id } = req.body
    let draft = await NewsletterDraft.findOne()
    if (!draft) draft = new NewsletterDraft()
  
    if (type === 'blog' && !draft.blogs.includes(id)) draft.blogs.push(id)
    if (type === 'event' && !draft.events.includes(id)) draft.events.push(id)
  
    await draft.save()
    res.json({ msg: 'Added to draft' })
    }
    catch (err) {
        res.status(500).json('Server error')
    }
}

exports.removeFromNewsletterDraft = async (req, res) => {
    try{
    const { type, id } = req.body
    const draft = await NewsletterDraft.findOne()
    if (!draft) return res.status(404).json({ msg: 'Draft not found' })
  
    if (type === 'blog') draft.blogs = draft.blogs.filter(b => b.toString() !== id)
    if (type === 'event') draft.events = draft.events.filter(e => e.toString() !== id)
  
    await draft.save()
    res.json({ msg: 'Removed from draft' })
    }
    catch (err) {
        res.status(500).json('Server error in remove newsletter draft')
    }
}

exports.getNewsletterDraft = async (req, res) => {
    try{
    const draft = await NewsletterDraft.findOne()
    .populate('blogs')
    .populate('events')

    res.json(draft || { blogs: [], events: [] })
    }
    catch (err) {
        res.status(500).json('Error getting draft')
    }
}

exports.sendNewsletter = async (req, res) => {
  try {
    const draft = await NewsletterDraft.findOne()
      .populate('blogs')
      .populate('events')

    if (!draft) {
      return res.status(404).json({ msg: 'No draft found' })
    }

    const subscribers = await NewsletterSubscribers.find()
      .populate('subscribers.user', 'email')

    if (!subscribers.length) {
      return res.status(400).json({ msg: 'No subscribers found' })
    }

    const bcc = subscribers.flatMap(sub =>
      sub.subscribers?.map(s => s.user?.email).filter(Boolean)
    )

    if (!bcc.length) {
      return res.status(400).json({ msg: 'No valid emails found' })
    }
    console.log(draft.blogs)

    const html = `
    <h1>You should definitely check out</h1>

    ${draft.blogs && draft.blogs.length > 0 ? `
    <h2>Blogs</h2>
    
    <table cellpadding="10" cellspacing="0" border="0">
    ${draft.blogs.map(blog => `
      <tr>
        <td style="border:1px solid #ccc; border-radius:8px; padding:10px; width:100%; max-width:500px;">
          <img src="${blog.thumbnail}" alt="${blog.title}" style="width:100%; max-width:480px; height:auto; border-radius:5px;" />
          <h2 style="margin:10px 0 5px 0;">${blog.title}</h2>
          <p style="margin:0; font-size:14px; color:#555;">${blog.description}</p>
        </td>
      </tr>
    `).join('')}
    </table>

    ` : ''}

    ${draft.events && draft.events.length > 0 ? `
    <h2>Events</h2>

    <table cellpadding="10" cellspacing="0" border="0">
    ${draft.events.map(event => `
      <tr>
        <td style="border:1px solid #ccc; border-radius:8px; padding:10px; width:100%; max-width:500px;">
          <img src="${event.thumbnail}" alt="${event.title}" style="width:100%; max-width:480px; height:auto; border-radius:5px;" />
          <h2 style="margin:10px 0 5px 0;">${event.title}</h2>
          <p style="margin:0; font-size:14px; color:#555;">${event.description}</p>
        </td>
      </tr>
    `).join('')}
    </table>
    ` : ''}

    `;

    try {
      await sendNewsletter({ bcc, subject: `Your Weekly Newsletter ${new Date().toDateString()}`, html })
      console.log('Newsletter email sent successfully')
    } catch (err) {
      console.error('Email send failed', err)
      return res.status(500).json({ msg: 'Send email failed', error: err.message })
    }

    await NewsletterDraft.deleteMany()

    return res.status(200).json({ msg: 'Newsletter sent successfully' })

  } catch (err) {
    if (!res.headersSent) {
      return res.status(500).json({ msg: 'Unexpected error', error: err.message })
    }
  }
}
