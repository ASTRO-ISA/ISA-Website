const express = require('express')
const restrictTo = require('../middlewares/restrictTo')
const {
  createAdmin,
  getAllAdmins,
  deleteAdmin,
  updateAdmin
} = require('../controllers/superAdminController')
const authenticateToken = require('../middlewares/authenticateToken')
const router = express.Router()

router.use(authenticateToken)
router.use(restrictTo(['super-admin']))
router.route('/admins').post(createAdmin).get(getAllAdmins)
router.route('/admin/:id').delete(deleteAdmin).patch(updateAdmin)

module.exports = router
