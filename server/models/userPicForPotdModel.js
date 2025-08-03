const mongoose = require('mongoose')

const sendPicSchema = new mongoose.Schema({ // xd
    caption: {
        type: String,
        required: [true, 'Caption is required.']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image url is required.']
    },
    socialLink: {
        type: String,
    },
    publicId: {
        type: String,
        required: [true, 'Public id is required.']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author info is required.']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const UserPicForPotd = mongoose.model('UserPicForPotd', sendPicSchema)

module.exports = UserPicForPotd