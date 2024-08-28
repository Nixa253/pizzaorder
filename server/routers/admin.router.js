const router = require('express').Router();
const AdminController = require('../controller/admin.controller');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/loginAdmin', AdminController.login);
router.get('/protected', authenticateToken, AdminController.protected);

module.exports = router;