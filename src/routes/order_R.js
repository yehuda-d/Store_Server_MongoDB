const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order_C');

router.post('/create', orderController.createOrder);
router.get('/all', orderController.getOrders);

module.exports = router;