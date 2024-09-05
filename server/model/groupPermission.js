const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

const groupPermissionSchema = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: 'group', required: true },
  permissionId: { type: Schema.Types.ObjectId, ref: 'permissions', required: true },
  controller: { type: String, required: true },
  action: { type: String, required: true }
},{ collection: 'groupPermission' });

const GroupPermission = db.model('groupPermission', groupPermissionSchema);

module.exports = GroupPermission;