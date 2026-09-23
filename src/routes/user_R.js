const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_C');

router.post('/create', userController.createUser);
router.get('/all', userController.getUsers);

module.exports = router;