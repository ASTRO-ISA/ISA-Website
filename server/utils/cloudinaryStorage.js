const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('./cloudinary')

const imageStorage = (folderName) =>
  new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
    }
  })

const documentStorage = (folderName) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: folderName,
      allowed_formats: ['pdf', 'docx', 'doc'],
      resource_type: 'raw'
    }
  })

module.exports = { imageStorage, documentStorage }
