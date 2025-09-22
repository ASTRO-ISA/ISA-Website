const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please tell us your email'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  phoneNo: {
    type: Number,
    required: [true]
  },
  avatar: {
    type: String,
    default: `profile-dark.webp`
  },
  avatarPublicId: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'super-admin'],
    default: 'user'
  },
  savedBlogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
  password: {
    type: String,
    minlength: [8, 'Minimum 8 characters'],
    required: [true, 'Password is required'],
    select: false
  },
  country: {
    type: String,
    default: 'India',
    enum: ['India', 'Canada', 'Nepal', 'USA']
  },
  passwordChangedAt: Date,
  isVerified: {
    type: Boolean,
    default: true,
    select: false
  },
  transactions: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentTransaction' }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

//Set passwordChangedAt
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next()
  this.passwordChangedAt = Date.now() - 1000
  next()
})

// //Hide inActive users
// userSchema.pre(/^find/, function (next) {
//   this.where({ isActive: { $ne: false } })
//   next()
// })

//Password verification
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

//Invalidate old JWTs
userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )
    return JWTTimeStamp < changedTimeStamp
  }
  return false
}

const User = mongoose.model('User', userSchema)

module.exports = User
