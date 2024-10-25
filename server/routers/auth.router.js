const router = require('express').Router();
const AuthController = require('../controller/auth.controller');

router.post('/auth/google', AuthController.googleAuth);
router.post('/auth/facebook', AuthController.facebookAuth);


module.exports = router;