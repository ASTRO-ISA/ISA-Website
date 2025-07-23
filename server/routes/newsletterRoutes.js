const express = require('express')
const router = express.Router()
const authenticateToken = require('../middlewares/authenticateToken')
const newsletterController = require('../controllers/newsletterController')
const restrictTo = require('../middlewares/restrictTo')

router.use(authenticateToken)
router.route('/subscribe').post(newsletterController.subscribeToNewsletter)

router.use(restrictTo('admin'))
router.route('/draft').get(newsletterController.getNewsletterDraft)
router.route('/draft/add').post(newsletterController.addToNewsletterDraft)
router.route('/draft/remove').post(newsletterController.removeFromNewsletterDraft)
router.route('/draft/send').post(newsletterController.sendNewsletter)

module.exports = router