const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');
const reset_password_enter_mail_router = require('./reset_password_enter_mail');
const api = require('./api')
const likes = require('./likes');


router.get('/', homeController.home);
router.get('/about_us', homeController.aboutUs);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'))
router.use('/comments', require('./comments'))
router.use('/reset_password', reset_password_enter_mail_router);
router.use('/likes', likes)

router.use('/api', require('./api'));



module.exports = router;