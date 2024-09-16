const router = require('express').Router();
const PermissionController = require('../controller/permission.controller');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');

router.post('/createPermission', authMiddleware, checkPermission('SuperAdminController', 'create', ['SuperAdmin', 'Admin']), PermissionController.create);
router.put('/updatePermission/:permissionId', authMiddleware, checkPermission('SuperAdminController', 'update', ['SuperAdmin', 'Admin']), PermissionController.update);
router.get('/permissions', authMiddleware, checkPermission('SuperAdminController', 'read', ['SuperAdmin', 'Admin']), PermissionController.readAll);
router.get('/permission/:permissionId', authMiddleware, checkPermission('SuperAdminController', 'read', ['SuperAdmin', 'Admin']), PermissionController.read);
router.delete('/deletePermission/:permissionId', authMiddleware, checkPermission('SuperAdminController', 'delete', ['SuperAdmin', 'Admin']), PermissionController.delete);

module.exports = router;