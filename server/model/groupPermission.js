const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

const groupPermissionSchema = new Schema({
  gr_id: { type: mongoose.Schema.Types.ObjectId, ref: 'group' },
  pe_id: { type: mongoose.Schema.Types.ObjectId, ref: 'permission' }
},{ collection: 'groupPermissionin' });

const GroupPermission = db.model('groupPermission', groupPermissionSchema);
module.exports = GroupPermission;
