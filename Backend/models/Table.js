const mongoose = require('mongoose');

// const tableSchema = new mongoose.Schema({
//   number: { type: Number, required: true },
// });


const tableSchema = new mongoose.Schema({
  number: Number,
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
});

module.exports = mongoose.model('Table', tableSchema);
