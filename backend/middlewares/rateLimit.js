const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

//Rate limiting for signup(5 attempts per hour)
const signupRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    error: 'Too many signup attempts from this IP, please try again after an hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many signup attempts from this IP, please try again after an hour'
    });
  }
});

//Slow down requests after 3 attempts
const signupSlowDown = slowDown({
  windowMs: 60 * 60 * 1000, 
  delayAfter: 3,
  delayMs: () => 5000,
  maxDelayMs: 30000,
});

//General rate limiting for all routes
const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too many requests from this IP, please try again later'
  }
});

module.exports = {
  signupRateLimit,
  signupSlowDown,
  generalRateLimit
};
