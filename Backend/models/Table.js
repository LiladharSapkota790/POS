const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  number: { type: Number, required: true },
});

module.exports = mongoose.model('Table', tableSchema);
