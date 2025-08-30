const User = require('../models/userModel')

//create admin
exports.createAdmin = async (req, res) => {
  try {
    const newAdmin = await User.create({
      name: req.body.name,
      email: req.body.email,
      phoneNo: req.body.phoneNo,
      role: 'admin',
      password: req.body.password,
      confirmPassword: req.body.confirmPassword
    })

    res.status(201).json({
      status: 'success',
      message: 'Admin created successfully',
      data: newAdmin
    })
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message })
  }
}

//get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' })

    if (!admins.length) {
      return res
        .status(200)
        .json({ status: 'success', data: [], message: 'No admins found' })
    }

    res
      .status(200)
      .json({ status: 'success', results: admins.length, data: admins })
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message })
  }
}

// Delete Admin
exports.deleteAdmin = async (req, res) => {
  try {
    const adminId = req.params.id
    const deletedAdmin = await User.findByIdAndDelete(adminId)

    if (!deletedAdmin) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Admin not found' })
    }

    res
      .status(200)
      .json({ status: 'success', message: 'Admin deleted successfully' })
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message })
  }
}

// Update Admin
exports.updateAdmin = async (req, res) => {
  try {
    const adminId = req.params.id
    const updatedAdmin = await User.findByIdAndUpdate(adminId, req.body, {
      new: true,
      runValidators: true
    })

    if (!updatedAdmin) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Admin not found' })
    }

    res.status(200).json({
      status: 'success',
      message: 'Admin updated successfully',
      data: updatedAdmin
    })
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message })
  }
}
