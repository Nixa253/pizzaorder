const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

const permissionSchema = new Schema({
    _id: Schema.Types.ObjectId,
    controller: { type: String, required: true },
    action: { type: String, required: true }
},{ collection: 'permission' });

const Permission = db.model('permission', permissionSchema);
module.exports = Permission;
