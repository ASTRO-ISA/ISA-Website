const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('./cloudinary')

const createStorage = (folderName) => new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,
      allowed_formats: ['jpg', 'png', 'jpeg'],
    },
  })

module.exports = createStorage