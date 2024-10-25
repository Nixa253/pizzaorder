const mongoose = require('mongoose');
const db = require('../config/db');

const { Schema } = mongoose;

// Voucher Schema
const voucherSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'], // percentage: giảm phần trăm, fixed: giảm cố định
        required: true
    },
    discountValue: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return value > 0;
            },
            message: 'Giá trị giảm giá phải lớn hơn 0'
        }
    },
    minimumOrderValue: {
        type: Number,
        default: 0, // Giá trị đơn hàng tối thiểu để áp dụng voucher
        validate: {
            validator: function(value) {
                return value >= 0;
            },
            message: 'Giá trị đơn hàng tối thiểu phải là số không âm'
        }
    },
    maximumDiscountValue: {
        type: Number,
        default: null, // Giá trị giảm giá tối đa (không bắt buộc)
        validate: {
            validator: function(value) {
                return value === null || value > 0;
            },
            message: 'Giá trị giảm tối đa phải lớn hơn 0 hoặc không giới hạn'
        }
    },
    applicablePizzas: [{
        type: Schema.Types.ObjectId,
        ref: 'product', // Liên kết đến model Product
        required: true
    }],
    startDate: {
        type: Date,
        required: true // Ngày bắt đầu hiệu lực của voucher
    },
    endDate: {
        type: Date,
        required: true, // Ngày hết hạn của voucher
        validate: {
            validator: function(value) {
                return this.startDate < value;
            },
            message: 'Ngày kết thúc phải sau ngày bắt đầu'
        }
    },
    quantity: {
        type: Number,
        default: null, // Nếu không giới hạn số lượng, để null
        validate: {
            validator: function(value) {
                return value === null || value > 0;
            },
            message: 'Số lượng voucher phải lớn hơn 0 hoặc không giới hạn'
        }
    },
    usageLimitPerAccount: {
        type: Number,
        required: true,
        default: 1,  // Số lần tối đa mà một tài khoản có thể sử dụng voucher
        validate: {
            validator: function(value) {
                return value > 0;
            },
            message: 'Giới hạn sử dụng phải lớn hơn 0'
        }
    },
    membershipTierRestrictions: {
        type: [String], // Ví dụ: ['bronze', 'silver', 'gold']
        default: [] // Nếu để trống, không hạn chế theo hạng thành viên
    },
    discountRules: {
        type: [String], // Các quy tắc giảm giá đặc biệt
        enum: ['max_discount_20k', 'percentage_10_percent_over_100k'],
        default: [] // Không bắt buộc
    },
    usedCount: {
        type: Number,
        default: 0 // Số lần voucher đã được sử dụng
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'used'], // Trạng thái voucher
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now // Thời gian tạo voucher
    }
}, { collection: 'voucher' });

// Middleware to automatically expire vouchers after the end date
voucherSchema.pre('save', function(next) {
    const now = new Date();
    if (this.endDate && now > this.endDate) {
        this.status = 'expired'; // Tự động đặt trạng thái hết hạn nếu quá ngày kết thúc
    }
    next();
});

// Method to check if a voucher is eligible for a user
voucherSchema.methods.isEligibleForUser = async function(userId) {
    const userUsage = await UserVoucherUsageModel.findOne({ userId, voucherId: this._id });
    if (userUsage && userUsage.usageCount >= this.usageLimitPerAccount) {
        return false; // Người dùng đã sử dụng hết số lần được phép sử dụng voucher này
    }
    return true;
};

// Method to calculate the discount for an order
voucherSchema.methods.calculateDiscount = function(orderTotal) {
    let discount = 0;

    // Apply discount based on discount type (percentage or fixed)
    if (this.discountType === 'percentage') {
        discount = orderTotal * (this.discountValue / 100);
        // If the rule to limit discount to 20k applies
        if (this.discountRules.includes('max_discount_20k')) {
            discount = Math.min(discount, 20000);  // Giảm giá tối đa là 20k
        }
    } else {
        discount = this.discountValue; // Giảm giá cố định
    }

    // Apply special discount rule: 10% for orders over 100k
    if (this.discountRules.includes('percentage_10_percent_over_100k') && orderTotal >= 100000) {
        discount = Math.min(orderTotal * 0.10, 20000); // Giảm 10% nhưng không quá 20k
    }

    // Ensure the discount does not exceed the maximum discount value if set
    return Math.min(discount, this.maximumDiscountValue || discount);
};

const VoucherModel = db.model('Voucher', voucherSchema);

module.exports = VoucherModel;
