const router = require('express').Router();
const GroupController = require('../controller/group.controller');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');

router.post('/createGroup', authMiddleware, checkPermission('SuperAdminController', 'create', 'SuperAdmin') , GroupController.create);

module.exports = router;