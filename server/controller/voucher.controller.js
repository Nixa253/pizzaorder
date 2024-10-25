const VoucherService = require('../services/voucher.service');
require('dotenv').config();

exports.getAllVouchers = async (req, res, next) => {
    try {
        const listVoucher = await VoucherService.getAllVouchers();
        res.json(listVoucher);
    } catch (error) {
        next(error);
    }
};

exports.getVoucherById = async (req, res, next) => {
    try {
        const voucher = await VoucherService.getVoucherById(req.params.voucherId);
        res.json(voucher);
    } catch (error) {
        next(error);
    }
};

exports.createVoucher = async (req, res, next) => {
    try {
        const newVoucher = await VoucherService.createVoucher(req.body);
        res.status(201).json(newVoucher);
    } catch (error) {
        next(error);
    }
};

exports.updateVoucherById = async (req, res, next) => {
    try {
        const updatedVoucher = await VoucherService.updateVoucherById(req.params.voucherId, req.body);
        res.json(updatedVoucher);
    } catch (error) {
        next(error);
    }
};

exports.deleteVoucherById = async (req, res, next) => {
    try {
        await VoucherService.deleteVoucherById(req.params.voucherId);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

exports.bulkDeleteVouchers = async (req, res, next) => {
    try {
        const result = await VoucherService.bulkDeleteVouchers(req.body.ids);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.updateUsageCount = async (req, res, next) => {
    try {
        const updatedVoucher = await VoucherService.updateUsageCount(req.params.id);
        res.json(updatedVoucher);
    } catch (error) {
        next(error);
    }
};