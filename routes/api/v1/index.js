const express = require('express');
const router = express.Router();
const postsApi = require('./posts');
const usersApi = require('./users');

router.use('/posts', postsApi);
router.use('/users', usersApi);

module.exports = router;