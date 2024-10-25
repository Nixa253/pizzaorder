const router = require('express').Router();
const GroupPermissionController = require('../controller/groupPermission.controller');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');

router.get('/groupPermission/:groupId', authMiddleware, GroupPermissionController.getByGroupId);
//router.get('/groupPermission/:groupId', authMiddleware, checkPermission('GroupPermissionController', 'read'), GroupPermissionController.getByGroupId);
router.post('/createGroupPermission', authMiddleware, checkPermission('GroupPermissionController', 'create'), GroupPermissionController.create);
router.delete('/deleteGroupPermission/:groupPermissionId', authMiddleware, checkPermission('GroupPermissionController', 'delete'), GroupPermissionController.delete);

module.exports = router;