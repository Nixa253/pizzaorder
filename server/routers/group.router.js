const router = require('express').Router();
const GroupController = require('../controller/group.controller');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');

router.post('/createGroup', authMiddleware, checkPermission('SuperAdminController', 'create', ['SuperAdmin', 'Admin']) , GroupController.create);
router.put('/updateGroup/:groupId', authMiddleware, checkPermission('SuperAdminController', 'update', ['SuperAdmin', 'Admin']), GroupController.update);
router.get('/readGroups', authMiddleware, checkPermission('SuperAdminController', 'read', ['SuperAdmin', 'Admin']), GroupController.readAll);
router.get('/readGroup/:groupId', authMiddleware, checkPermission('SuperAdminController', 'read', ['SuperAdmin', 'Admin']), GroupController.read);
router.delete('/deleteGroup/:groupId', authMiddleware, checkPermission('SuperAdminController', 'delete', ['SuperAdmin', 'Admin']), GroupController.delete);

module.exports = router;