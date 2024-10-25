const CouponModel = require('../model/coupon.model');
const mongoose = require('mongoose');


class CouponService {
  
    static async getAllCoupons() {
        try {
            return await CouponModel.find();
        } catch (error) {
            throw error.message;
        }
    }

    static async getCouponById(id) {
        try {
          const coupon = await CouponModel.findById(id);
          if (!coupon) {
            throw new Error('Coupon not found');
          }
          return coupon;
        } catch (error) {
          throw error.message;
        }
      }

    static async updateUsageCount(id) {
        try {
            const coupon = await CouponModel.findById(id);
            if (!coupon) {
                throw new Error('Coupon not found');
            }

            coupon.usageCount -= 1;
            if (coupon.usageCount < 0) coupon.usageCount = 0; // Đảm bảo usageCount không âm
            await coupon.save();

            return coupon;
        } catch (error) {
            throw error.message;
        }
    }

    static async createCoupon(couponData) {
        try {
          const newCoupon = new CouponModel({
            _id: new mongoose.Types.ObjectId(),
            ...couponData
          });
          return await newCoupon.save();
        } catch (error) {
          throw error.message;
        }
      }
    
      static async updateCouponById(id, updateData) {
        try {
          const updatedCoupon = await CouponModel.findByIdAndUpdate(id, updateData, { new: true });
          if (!updatedCoupon) {
            throw new Error('Coupon not found');
          }
          return updatedCoupon;
        } catch (error) {
          throw error.message;
        }
      }
    
      static async deleteCouponById(id) {
        try {
          const deletedCoupon = await CouponModel.findByIdAndDelete(id);
          if (!deletedCoupon) {
            throw new Error('Coupon not found');
          }
          return deletedCoupon;
        } catch (error) {
          throw error.message;
        }
      }
    
      static async bulkDeleteCoupons(ids) {
        try {
          const result = await CouponModel.deleteMany({ _id: { $in: ids } });
          return result;
        } catch (error) {
          throw error.message;
        }
      }
    
      static async updateUsageCount(id) {
        try {
          const coupon = await CouponModel.findById(id);
          if (!coupon) {
            throw new Error('Coupon not found');
          }
    
          coupon.usageCount -= 1;
          if (coupon.usageCount < 0) coupon.usageCount = 0;
          await coupon.save();
    
          return coupon;
        } catch (error) {
          throw error.message;
        }
      }

}

module.exports = CouponService;