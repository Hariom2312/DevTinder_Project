const express = require('express');
const router = express.Router();

const {getUserInfo ,adduser} = require('../controller/UserController');

router.get('/api/userinfo',getUserInfo);
router.post('/api/adduser',adduser);

module.exports = router;