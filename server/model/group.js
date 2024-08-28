const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

const groupSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true, unique: true },
    description: { type: String }
},{ collection: 'group' });

const Group = db.model('group', groupSchema);
module.exports = Group;
