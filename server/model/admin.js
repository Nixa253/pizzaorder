const mongoose = require('mongoose');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const adminSchema = new Schema({
    email: { 
        type: String, 
        unique: true, 
        lowercase: true, 
        trim: true, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    surname: { 
        type: String, 
        required: true 
    },
    photo: { 
        type: String, 
        trim: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
  }, { collection: 'admin' });
  
  // Mã hóa mật khẩu trước khi lưu vào DB
  adminSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        return next(error);
      }
    }
    next();
  });
  
const AdminModel = db.model('admin', adminSchema);

module.exports = AdminModel;