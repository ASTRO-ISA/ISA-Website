const cron = require('node-cron')
const UserPicForPotdModel = require('../../models/userPicForPotdModel')
const cloudinary = require('cloudinary').v2

cron.schedule("10 0 */2 * *", async () => {
    try {
      const images = await UserPicForPotdModel.find()
  
      for (const image of images) {
        const publicId = image.publicId
        if (publicId) {
          await cloudinary.uploader.destroy(publicId)
        }
      }
  
      await UserPicForPotdModel.deleteMany({})
      console.log("Cleared all user images and emptied the collection.")
    } catch (error) {
      console.error("Error during cleanup:", error.message)
    }
  })