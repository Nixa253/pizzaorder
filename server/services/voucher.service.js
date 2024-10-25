const VoucherModel = require('../model/voucher.model');
const mongoose = require('mongoose');

class VoucherService {

    static async getAllVouchers() {
        try {
            return await VoucherModel.find();
        } catch (error) {
            throw error.message;
        }
    }

    static async getVoucherById(id) {
        try {
            const voucher = await VoucherModel.findById(id);
            if (!voucher) {
                throw new Error('Voucher not found');
            }
            return voucher;
        } catch (error) {
            throw error.message;
        }
    }

    static async createVoucher(voucherData) {
        try {
            const newVoucher = new VoucherModel({
                _id: new mongoose.Types.ObjectId(),
                ...voucherData
            });
            return await newVoucher.save();
        } catch (error) {
            throw error.message;
        }
    }

    static async updateVoucherById(id, updateData) {
        try {
            const updatedVoucher = await VoucherModel.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedVoucher) {
                throw new Error('Voucher not found');
            }
            return updatedVoucher;
        } catch (error) {
            throw error.message;
        }
    }

    static async deleteVoucherById(id) {
        try {
            const deletedVoucher = await VoucherModel.findByIdAndDelete(id);
            if (!deletedVoucher) {
                throw new Error('Voucher not found');
            }
            return deletedVoucher;
        } catch (error) {
            throw error.message;
        }
    }

    static async bulkDeleteVouchers(ids) {
        try {
            const result = await VoucherModel.deleteMany({ _id: { $in: ids } });
            return result;
        } catch (error) {
            throw error.message;
        }
    }

    static async updateUsageCount(id) {
        try {
            const voucher = await VoucherModel.findById(id);
            if (!voucher) {
                throw new Error('Voucher not found');
            }

            voucher.usageCount -= 1;
            if (voucher.usageCount < 0) voucher.usageCount = 0;
            await voucher.save();

            return voucher;
        } catch (error) {
            throw error.message;
        }
    }
}

module.exports = VoucherService;