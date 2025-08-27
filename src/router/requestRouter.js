const express = require('express');
const {auth} = require('../middleware/auth');
const requestRouter = express.Router();
const {sendConnectionRequest , reviewConnectionRequest} = require('../controller/request');

requestRouter.post('/request/send/:status/:toUserId',auth,sendConnectionRequest);  // interested and ignored

requestRouter.post('/request/review/:status/:requestId',auth,reviewConnectionRequest); // accepted and rejected

module.exports = requestRouter;