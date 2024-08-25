

const mongoose = require('mongoose');

// const OrderSchema = new mongoose.Schema({
//   tableId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Table', 
//     required: true
//   },
//   items: [{
//     name: {
//       type: String,
//       required: true
//     },
//     comment: {
//       type: String,
//       default: ''
//     },
//     price: {
//       type: Number,
//       required: true
//     }
//   }],
//   paymentMethod: {
//     type: String,
//     required: true
//   },
//   status: {
//     type: String,
//     default: 'pending'
//   },
//   totalAmount: {
//     type: Number,
//     default: 0
//   },
//   orderDate: {
//     type: Date,
//     default: Date.now
//   }
// });


const OrderSchema = new mongoose.Schema({
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table', 
    required: true
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: true
    }
  }],
  paymentMethod: {
    type: String
  },
  status: {
    type: String,
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  orderStartTime: {
    type: Date,
    default: Date.now // Automatically set to the time the order is created
  },
  orderEndTime: {
    type: Date // Will be set when the order is completed
  }
});



const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
