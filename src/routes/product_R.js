const express = require('express');
const router = express.Router();
const productController = require('../controllers/product_C');

// CRUD Routes
router.post('/create', productController.createProduct);
router.get('/all', productController.getProducts);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;