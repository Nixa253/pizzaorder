const mongoose = require('mongoose');
const db = require('../config/db');
const GroupPermission = require('./groupPermission');
const { Schema } = mongoose;

const permissionSchema = new Schema({
  controller: { type: String, required: true },
  action: { type: String, required: true }
},{ collection: 'permissions' });

permissionSchema.post('save', async function(doc) {
  try {
    const Group = require('./group');
    const groups = await Group.find();
    const groupPermissions = groups.map(group => ({
      groupId: group._id,
      permissionId: doc._id,
      controller: doc.controller,
      action: doc.action
    }));
    
    await GroupPermission.insertMany(groupPermissions);
    console.log('GroupPermissions created after Permission save');
  } catch (error) {
    console.error('Error in Permission post-save hook:', error);
  }
});

const Permission = db.model('permissions', permissionSchema);

module.exports = Permission;
