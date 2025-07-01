const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, secret, { expiresIn: '30d' });
};

const verifyToken = (token) => {
  return jwt.verify(token, secret);
};

module.exports = { generateToken, verifyToken };