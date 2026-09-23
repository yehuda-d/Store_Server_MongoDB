const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category_C');

// נתיבים עבור קטגוריות
router.post('/create', categoryController.createCategory);
router.get('/all', categoryController.getCategories);

module.exports = router;