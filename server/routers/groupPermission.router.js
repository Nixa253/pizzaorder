const router = require('express').Router();
const GroupPermissionController = require('../controller/groupPermission.controller');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');

router.get('/groupPermission/:groupId', authMiddleware, GroupPermissionController.getByGroupId);
router.post('/createGroupPermission', authMiddleware, checkPermission('SuperAdminController', 'create', ['SuperAdmin','SuperAdmin']), GroupPermissionController.create);
router.delete('/deleteGroupPermission/:groupPermissionId', authMiddleware, checkPermission('SuperAdminController', 'delete', ['SuperAdmin','SuperAdmin']), GroupPermissionController.delete);

module.exports = router;