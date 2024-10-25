const router = require('express').Router();
const PermissionController = require('../controller/permission.controller');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');

router.post('/createPermission', authMiddleware, checkPermission('PermissionController', 'create'), PermissionController.create);
router.put('/updatePermission/:permissionId', authMiddleware, checkPermission('PermissionController', 'update'), PermissionController.update);
router.get('/permissions', authMiddleware, checkPermission('PermissionController', 'read'), PermissionController.readAll);
router.get('/permission/:permissionId', authMiddleware, checkPermission('PermissionController', 'read'), PermissionController.read);
router.delete('/deletePermission/:permissionId', authMiddleware, checkPermission('PermissionController', 'delete'), PermissionController.delete);

module.exports = router;