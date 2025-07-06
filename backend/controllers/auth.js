const { User } = require('../models/User.js');
const { generateToken } = require('../config/jwt.js');
const bcrypt = require('bcryptjs');
const { getAuthUrl, getTokensFromCode } = require('../services/reddit');

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save(); 
    const token = generateToken(user._id);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = generateToken(user._id);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

//New Reddit auth endpoints
const getRedditAuthUrl = (req, res) => {
  try {
    const authUrl = getAuthUrl();
    res.json({ authUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleRedditCallback = async (req, res) => {
  try {
    const { code } = req.query;
    console.log('Reddit callback hit. Code:', code);
    if (!code) throw new Error('No authorization code provided');

    const { accessToken, refreshToken, snoowrapInstance } = await getTokensFromCode(code);
    console.log('Tokens:', { accessToken, refreshToken });
    const redditUser = await snoowrapInstance.getMe();
    const redditUsername = redditUser.name;
    console.log('Reddit username:', redditUsername);

    // Find or create user
    let user = await User.findOne({ redditUsername });
    if (!user) {
      user = new User({ redditUsername, redditRefreshToken: refreshToken, password: Math.random().toString(36).slice(-8), email: `${redditUsername}@reddit.com` });
      console.log('Creating new user:', user);
    } else {
      user.redditRefreshToken = refreshToken;
      console.log('Updating existing user:', user);
    }
    await user.save();

    // Issue JWT
    const token = generateToken(user._id);
    console.log('Generated JWT:', token);

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/auth/reddit/callback?token=${token}`;
    console.log('Redirecting to:', redirectUrl);
    res.redirect(redirectUrl);
  } catch (err) {
    console.error('Error in Reddit callback:', err);
    res.status(400).json({ error: err.message });
  }
};

const getRedditStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    
    if (!user || !user.redditRefreshToken) {
      return res.status(403).json({ error: "Reddit account not connected" });
    }

    // Create Reddit client
    const snoowrap = require('snoowrap');
    const r = new snoowrap({
      userAgent: process.env.REDDIT_USER_AGENT,
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      refreshToken: user.redditRefreshToken
    });

    // Get Reddit user info
    const redditUser = await r.getMe();
    
    // Calculate account age in days
    const accountAge = Math.floor((Date.now() - redditUser.created_utc * 1000) / (1000 * 60 * 60 * 24));
    
    // Get karma 
    const karma = redditUser.link_karma + redditUser.comment_karma;
    
    // Check if domain is blocked
    const domainBlocked = false;

    res.json({
      accountAge,
      karma,
      domainBlocked,
      username: redditUser.name
    });
  } catch (err) {
    console.error('Error getting Reddit status:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { 
  signup, 
  login,
  getRedditAuthUrl,
  handleRedditCallback,
  getRedditStatus
};
