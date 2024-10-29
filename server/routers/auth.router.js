const router = require('express').Router();
const AuthController = require('../controller/auth.controller');

router.post('/auth/google', AuthController.googleAuth);
router.post('/auth/facebook', AuthController.facebookAuth);
router.post('/sendOtp', AuthController.sendOtp); 
router.post('/verifyOtp', AuthController.verifyOtp); 


module.exports = router;