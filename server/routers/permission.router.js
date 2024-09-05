const router = require('express').Router();
const PermissionController = require('../controller/permission.controller');

router.post('/createPermission', PermissionController.create);

module.exports = router;