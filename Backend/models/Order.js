// const mongoose = require('mongoose');

// const OrderSchema = new mongoose.Schema({
//   tableId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Table', // Adjust based on your schema
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
//   }
// });

// const Order = mongoose.model('Order', OrderSchema);

// module.exports = Order;


const mongoose = require('mongoose');

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
    type: String,
    required: true
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
  }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
