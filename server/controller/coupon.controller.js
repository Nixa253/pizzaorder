const CouponService = require('../services/coupon.service');
require('dotenv').config();

exports.getAllCoupons = async (req, res, next) => {
    try {
        const listCoupon = await CouponService.getAllCoupons();
        res.json(listCoupon);
    } catch (error) {
        next(error);
    }
};

exports.getCouponById = async (req, res, next) => {
    try {
        const coupon = await CouponService.getCouponById(req.params.couponId);
        res.json(coupon);
    } catch (error) {
        next(error);
    }
};

exports.createCoupon = async (req, res, next) => {
    try {
        const newCoupon = await CouponService.createCoupon(req.body);
        res.status(201).json(newCoupon);
    } catch (error) {
        next(error);
    }
};

exports.updateCouponById = async (req, res, next) => {
    try {
        const updatedCoupon = await CouponService.updateCouponById(req.params.couponId, req.body);
        res.json(updatedCoupon);
    } catch (error) {
        next(error);
    }
};

exports.deleteCouponById = async (req, res, next) => {
    try {
        await CouponService.deleteCouponById(req.params.couponId);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

exports.bulkDeleteCoupons = async (req, res, next) => {
    try {
        const result = await CouponService.bulkDeleteCoupons(req.body.ids);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.updateUsageCount = async (req, res, next) => {
    try {
        const updatedCoupon = await CouponService.updateUsageCount(req.params.id);
        res.json(updatedCoupon);
    } catch (error) {
        next(error);
    }
};