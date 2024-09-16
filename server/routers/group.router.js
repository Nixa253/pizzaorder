const router = require('express').Router();
const GroupController = require('../controller/group.controller');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');

router.post('/createGroup', authMiddleware, checkPermission('SuperAdminController', 'create', ['SuperAdmin','SuperAdmin']) , GroupController.create);
router.put('/updateGroup/:groupId', authMiddleware, checkPermission('SuperAdminController', 'update',  ['SuperAdmin','SuperAdmin']), GroupController.update);
router.get('/readGroups', authMiddleware, checkPermission('SuperAdminController', 'read',  ['SuperAdmin','SuperAdmin']), GroupController.readAll);
router.get('/readGroup/:groupId', authMiddleware, checkPermission('SuperAdminController', 'read',  ['SuperAdmin','SuperAdmin']), GroupController.read);
router.delete('/deleteGroup/:groupId', authMiddleware, checkPermission('SuperAdminController', 'delete',  ['SuperAdmin','SuperAdmin']), GroupController.delete);

module.exports = router;

