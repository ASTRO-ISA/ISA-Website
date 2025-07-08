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
  avatarPublicId: {
    type: String
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
  // confirmPassword: {
  //   type: String,
  //   minlength: 8,
  //   required: [true, 'Confirm Password is required'],
  //   validate: {
  //     // this only work on save ans create
  //     validator: function (el) {
  //       return el === this.password
  //     },
  //     message: 'passwords are not same'
  //   }
  // },
  country: {
    type: String,
    default: 'India',
    enum: ['India', 'Canada', 'Nepal', 'USA']
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
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

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next()
  this.passwordChangedAt = Date.now() - 1000
  next()
})

userSchema.pre(/^find/, function (next) {
  this.where({ active: { $ne: false } })
  next()
})

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changePasswordAfter = async function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )
    // console.log(changedTimeStamp, JWTTimeStamp);
    return JWTTimeStamp < changedTimeStamp
  }

  // false means not changed
  return false
}

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex')
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000
  return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User
