const { verifyToken } = require('../config/jwt');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authenticate;