const express = require('express');
const { 
  signup, 
  login
} = require('../controllers/auth');
const { signupRateLimit, signupSlowDown } = require('../middlewares/rateLimit');
const { verifyCaptcha } = require('../middlewares/captcha');
const router = express.Router();

router.post('/signup', 
  signupRateLimit, 
  signupSlowDown, 
  verifyCaptcha, 
  signup
);

router.post('/login', login);

module.exports = router;
