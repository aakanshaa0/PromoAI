const express = require('express');
const { submitProduct, getProduct, getProducts, testParsing } = require('../controllers/product');
const authenticate = require('../middlewares/auth');
const router = express.Router();

router.post('/', authenticate, submitProduct);
router.get('/:productId', authenticate, getProduct);
router.get('/', authenticate, getProducts);
router.get('/test/parsing', testParsing);

module.exports = router;
