const express = require('express');
const { 
  signup, 
  login,
  getRedditAuthUrl,
  handleRedditCallback
} = require('../controllers/auth');
const authenticate = require('../middlewares/auth');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.get('/reddit/auth', authenticate, getRedditAuthUrl);
router.get('/reddit/callback', authenticate, handleRedditCallback);

module.exports = router;
