const router = require('express').Router();
const VoucherController = require('../controller/voucher.controller');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');

// Public routes
router.get('/getAllVouchers', VoucherController.getAllVouchers);
router.put('/updateUsageCount/:id', VoucherController.updateUsageCount);

// Website Admin routes
router.get('/vouchers', authMiddleware, checkPermission('VoucherController', 'read'), VoucherController.getAllVouchers);
router.get('/vouchers/:voucherId', authMiddleware, checkPermission('VoucherController', 'read'), VoucherController.getVoucherById);
router.post('/createVoucher', authMiddleware, checkPermission('VoucherController', 'create'), VoucherController.createVoucher);
router.put('/updateVoucher/:voucherId', authMiddleware, checkPermission('VoucherController', 'update'), VoucherController.updateVoucherById);
router.post('/bulkDeleteVouchers', authMiddleware, checkPermission('VoucherController', 'delete'), VoucherController.bulkDeleteVouchers);
router.delete('/deleteVoucher/:voucherId', authMiddleware, checkPermission('VoucherController', 'delete'), VoucherController.deleteVoucherById);

module.exports = router;