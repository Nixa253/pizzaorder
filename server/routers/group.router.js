const router = require('express').Router();
const GroupController = require('../controller/group.controller');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');

router.post('/createGroup', authMiddleware, checkPermission('GroupController', 'create') , GroupController.create);
router.put('/updateGroup/:groupId', authMiddleware, checkPermission('GroupController', 'update'), GroupController.update);
router.get('/readGroups', authMiddleware, checkPermission('GroupController', 'read'), GroupController.readAll);
router.get('/readGroup/:groupId', authMiddleware, checkPermission('GroupController', 'read'), GroupController.read);
router.delete('/deleteGroup/:groupId', authMiddleware, checkPermission('GroupController', 'delete'), GroupController.delete);

module.exports = router;

