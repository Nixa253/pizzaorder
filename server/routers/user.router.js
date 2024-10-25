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
router.get('/users', authMiddleware, checkPermission('UserController', 'read'), UserController.users);
router.get('/users/:userId', authMiddleware, checkPermission('UserController', 'read'), UserController.getUserById);
router.post('/createUser', authMiddleware, checkPermission('UserController', 'create'), UserController.createUser);
router.put('/updateUser/:userId', authMiddleware, checkPermission('UserController', 'update'), UserController.updateUserById);
router.delete('/deleteUser/:userId', authMiddleware, checkPermission('UserController', 'delete'), UserController.deleteUserById);
router.post('/bulkDeleteUsers', authMiddleware, checkPermission('UserController', 'delete'), UserController.bulkDeleteUsers);

module.exports = router;