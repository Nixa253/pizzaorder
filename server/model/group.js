const mongoose = require('mongoose');
const db = require('../config/db');
const Permission = require('./permissions');
const GroupPermission = require('./groupPermission');
const { Schema } = mongoose;

const groupSchema = new Schema({
  name: { type: String, required: true }
},{ collection: 'group' });

// groupSchema.post('save', async function(doc) {
//   try{
//     const permissions = await Permission.find();
//     const groupPermissions = permissions.map(permission => ({
//       groupId: doc._id,
//       permissionId: permission._id,
//       controller: permission.controller,
//       action: permission.action
//     }));
    
//     await GroupPermission.insertMany(groupPermissions);
//     console.log('GroupPermissions created after Group save');
//   } catch (error) {
//     console.error('Error in Group post-save hook:', error);
//   }});

const Group = db.model('group', groupSchema);

module.exports = Group;