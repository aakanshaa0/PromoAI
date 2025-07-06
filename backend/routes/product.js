const express = require('express');
const { submitProduct, promoteProduct } = require('../controllers/product');
const authenticate = require('../middlewares/auth');
const router = express.Router();

router.post('/', authenticate, submitProduct);
router.post('/promote', authenticate, promoteProduct);

module.exports = router;
