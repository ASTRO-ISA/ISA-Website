const Event = require('../models/eventModel')
exports.verifyQR = async (req, res) => {
    try {
      const { token } = req.params
      const scannerId = req.user._id
  
      // Find event containing this token
      const event = await Event.findOne({ 'registeredUsers.token': token })
        .populate('registeredUsers.user', 'name email')
        .populate('scanners', 'email name')
  
      // If no event contains this token
      if (!event) {
        return res.status(400).json({ success: false, message: '❌ QR does not exist' })
      }
  
      // Find the registered user object
      const regUser = event.registeredUsers.find(r => r.token === token)
      if (!regUser) {
        return res.status(400).json({ success: false, message: '❌ QR does not exist' })
      }
  
      // Check authorization
      const isCreator = event.createdBy.toString() === scannerId.toString()
      const isAdmin = req.user.role === 'admin'
    //   const isScanner = event.scanners.some(s => s.toString() === scannerId.toString())
    const isScanner = event.scanners.some(s => s._id.toString() === scannerId.toString())
  
      if (!isCreator && !isAdmin && !isScanner) {
        return res.status(403).json({ success: false, message: 'You are not authorized to scan this event' })
      }
  
      // If already used, return success but indicate it's already scanned
      if (regUser.used) {
        return res.status(200).json({
          success: true,
          alreadyScanned: true,
          message: '⚠️ QR already scanned',
          user: regUser.user,
          event: {
            title: event.title,
            date: event.eventDate,
            location: event.location
          }
        })
      }
  
      // Mark as used
      regUser.used = true
      await event.save()
  
      // Respond with user details
      res.status(200).json({
        success: true,
        alreadyScanned: false,
        message: '✅ QR verified successfully',
        user: regUser.user,
        event: {
          title: event.title,
          date: event.eventDate,
          location: event.location
        }
      })
    } catch (error) {
      console.error('QR verification error:', error)
      res.status(500).json({ success: false, message: '⚠️ Server error, try again later' })
    }
  }

exports.addScanner = async (req, res) => {
    console.log('i am up here')
    try {
      const { eventSlug } = req.params
      const { email } = req.body
      console.log(email)
  
      // Find user by email
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' })
      }
      console.log(' i am here')
  
      // Find event by slug
      const event = await Event.findOne({ slug: eventSlug })
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' })
      }
      console.log(' i am here')
      // Only event creator or admin can add scanners
      if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized to add scanners' })
      }
  
      // Check if already a scanner
      if (event.scanners.includes(user._id)) {
        return res.status(400).json({ success: false, message: 'User is already a scanner' })
      }
  
      event.scanners.push(user._id)
      await event.save()
  
      res.status(200).json({
        success: true,
        message: 'Scanner added successfully',
        scanner: { name: user.name, email: user.email }
      })
    } catch (error) {
      console.error('Add scanner error:', error)
      res.status(500).json({ success: false, message: 'Server error' })
    }
  }