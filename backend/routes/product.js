const express = require('express');
const { submitProduct } = require('../controllers/product');
const authenticate = require('../middlewares/auth');
const router = express.Router();

router.post('/', authenticate, submitProduct);

module.exports = router;
