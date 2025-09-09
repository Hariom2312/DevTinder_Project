const Razorpay = require('razorpay');
require('dotenv').config();

const RazorpayInstance = new Razorpay({
    key_id:process.env.RAZORPAY_KEY,
    key_secret:process.env.RAZORPAY_SECRET
});

module.exports = RazorpayInstance;