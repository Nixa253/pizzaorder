const router = require('express').Router();
const CouponController = require('../controller/coupon.controller');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');

router.get('/getAllCoupons', CouponController.getAllCoupons);
// tru usecount
router.put('/updateUsageCount/:id', CouponController.updateUsageCount);

// Website Admin routes
router.get('/coupons', authMiddleware, checkPermission('CouponController', 'read'), CouponController.getAllCoupons);
router.get('/coupons/:couponId', authMiddleware, checkPermission('CouponController', 'read'), CouponController.getCouponById);
router.post('/createCoupon', authMiddleware, checkPermission('CouponController', 'create'), CouponController.createCoupon);
router.put('/updateCoupon/:couponId', authMiddleware, checkPermission('CouponController', 'update'), CouponController.updateCouponById);
router.post('/bulkDeleteCoupons', authMiddleware, checkPermission('CouponController', 'delete'), CouponController.bulkDeleteCoupons);
router.delete('/deleteCoupon/:couponId', authMiddleware, checkPermission('CouponController', 'delete'), CouponController.deleteCouponById);

module.exports = router;