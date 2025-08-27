const express = require('express');
const userRouter = express.Router();

const {auth} = require('../middleware/auth');
const {getUserDetails , getUserConnection , getUserFeed , deleteAccount} = require('../controller/user');

userRouter.get('/user/pending_request',auth,getUserDetails);
userRouter.get('/user/connections',auth,getUserConnection);
userRouter.get('/user/feed',auth,getUserFeed);
userRouter.delete('/user/delete_account',auth,deleteAccount);

module.exports = userRouter;
