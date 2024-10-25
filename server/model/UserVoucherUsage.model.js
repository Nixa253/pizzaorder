const mongoose = require('mongoose');
const db = require('../config/db');

const { Schema } = mongoose;

const userVoucherUsageSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user', // Liên kết đến bảng User
        required: true
    },
    voucherId: {
        type: Schema.Types.ObjectId,
        ref: 'Voucher', // Liên kết đến bảng Voucher
        required: true
    },
    usageCount: {
        type: Number,
        default: 0, // Số lần người dùng đã sử dụng voucher này
        validate: {
            validator: function(value) {
                return value >= 0;
            },
            message: 'Số lần sử dụng phải lớn hơn hoặc bằng 0'
        }
    },
    lastUsedAt: {
        type: Date,
        default: null // Ngày mà người dùng sử dụng voucher lần cuối cùng
    }
}, { collection: 'user_voucher_usage' });

const UserVoucherUsageModel = db.model('UserVoucherUsage', userVoucherUsageSchema);

module.exports = UserVoucherUsageModel;
