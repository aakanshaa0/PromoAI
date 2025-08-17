const express = require('express');
const { submitProduct, getProduct, getProducts, testParsing, regenerateProduct, testImageGeneration, testCloudinaryConfig } = require('../controllers/product');
const authenticate = require('../middlewares/auth');
const router = express.Router();

router.post('/', authenticate, submitProduct);
router.get('/:productId', authenticate, getProduct);
router.get('/', authenticate, getProducts);
router.get('/test/parsing', testParsing);
router.post('/:productId/regenerate', authenticate, regenerateProduct);
router.post('/test/image-generation', authenticate, testImageGeneration);
router.get('/test/cloudinary-config', authenticate, testCloudinaryConfig);

module.exports = router;
