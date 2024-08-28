const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

const adminGroupSchema = new Schema({
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
  gr_id: { type: mongoose.Schema.Types.ObjectId, ref: 'group' }
},{ collection: 'adminGroup' });

const AdminGroup = db.model('adminGroup', adminGroupSchema);
module.exports = AdminGroup;
