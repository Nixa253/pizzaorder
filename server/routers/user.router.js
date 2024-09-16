const router = require('express').Router();
const UserController = require('../controller/user.controller');
const authenticateJWT = require('../middleware/authenticationJwt');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');

//App
router.post('/registration', UserController.register);
router.post('/login', UserController.login);
router.get('/getUserInfo', authenticateJWT, UserController.getUserInfo);
router.put('/editUser', authenticateJWT, UserController.editUser);
router.put('/updateAddress', authenticateJWT, UserController.updateAddress);

//Website Admin
router.get('/users', authMiddleware, checkPermission('SuperAdminController', 'read',  ['SuperAdmin','SuperAdmin']), UserController.users);

module.exports = router;