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
    const userId = req.userId;
    
    if (!code) throw new Error('No authorization code provided');
    
    const tokens = await getTokensFromCode(code);
    
    //Save the refresh token to the user in database
    const user = await User.findByIdAndUpdate(userId, {
      redditRefreshToken: tokens.refreshToken
    }, { new: true });
    
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { 
  signup, 
  login,
  getRedditAuthUrl,
  handleRedditCallback
};
