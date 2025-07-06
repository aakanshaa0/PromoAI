const express = require('express');
const { 
  signup, 
  login,
  getRedditAuthUrl,
  handleRedditCallback,
  getRedditStatus
} = require('../controllers/auth');
const authenticate = require('../middlewares/auth');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.get('/reddit/auth', getRedditAuthUrl);
router.get('/reddit/callback', handleRedditCallback);
router.get('/reddit/status', authenticate, getRedditStatus);

module.exports = router;
