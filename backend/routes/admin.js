const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const adminController = require('../controllers/adminController');

router.use(apiLimiter, auth, isAdmin);

router.get('/users', adminController.listUsers);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
