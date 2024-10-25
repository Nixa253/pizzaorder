const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

const toppingSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String },
  price: { type: Number, required: true }
}, { collection: 'topping' });

const ToppingModel = db.model('topping', toppingSchema);

module.exports = ToppingModel;