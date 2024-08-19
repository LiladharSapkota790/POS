const express = require('express');
const router = express.Router();
const Table = require('../models/Table');
const Order = require("../models/Order");

// GET all tables
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Fetch current order for a table
router.get('/orders/:tableId', async (req, res) => {
  try {
    const { tableId } = req.params;
    const order = await Order.findOne({ tableId, status: 'pending' });
    if (order) {
      return res.json(order);
    } else {
      return res.status(404).json({ message: 'No active order found for this table.' });
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ message: 'Error fetching order', error });
  }
});







// // Update order status to completed
// router.post('/checkout', async (req, res) => {
//   try {
//     const { tableId, items, paymentMethod, amountReceived, change } = req.body;
//     const order = await Order.findOneAndUpdate(
//       { tableId, status: 'pending' },
//       {
//         items,
//         paymentMethod,
//         totalAmount: items.reduce((acc, item) => acc + item.price, 0),
//         status: 'completed'
//       },
//       { new: true }
//     );
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found or already completed.' });
//     }
//     res.json(order);
//   } catch (error) {
//     console.error('Error during checkout:', error);
//     res.status(500).json({ message: 'Error during checkout', error });
//   }
// });




// Update order status to completed
router.post('/checkout', async (req, res) => {
  try {
    const { items, paymentMethod, amountReceived } = req.body;
    const order = await Order.findOneAndUpdate(
      { status: 'pending' },
      {
        items,
        paymentMethod,
        totalAmount: items.reduce((acc, item) => acc + item.price, 0),
        status: 'completed'
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found or already completed.' });
    }

    const change = amountReceived - order.totalAmount;
    res.json({ order, change });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ message: 'Error during checkout', error });
  }
});





module.exports = router;
