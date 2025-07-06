const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboard.js');
const auth = require('../middlewares/auth.js');

router.get('/', auth, getDashboardData);

module.exports = router; 