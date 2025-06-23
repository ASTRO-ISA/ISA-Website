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
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    minlength: [8, 'Minimum 8 character'],
    required: [true, 'Password is required'],
    select: false
  },
  confirmPassword: {
    type: String,
    minlength: 8,
    required: [true, 'Confirm Password is required'],
    validate: {
      // this only work on save ans create
      validator: function (el) {
        return el === this.password
      },
      message: 'passwords are not same'
    }
  },
  country: {
    type: String,
    default: 'India',
    enum: ['India', 'Canada', 'Nepal', 'USA']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  // hash the password
  this.password = await bcrypt.hash(this.password, 12)
  // delete the confirm password field
  this.confirmPassword = undefined
  next()
})

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

const User = mongoose.model('User', userSchema)

module.exports = User
