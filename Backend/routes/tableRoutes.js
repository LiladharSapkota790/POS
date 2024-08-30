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




// router.post('/checkout', async (req, res) => {
//   try {
//     const { tableId, items, paymentMethod, amountReceived } = req.body;

//     // Find the first pending order, or use a specific order ID if provided
//     const order = await Order.findOneAndUpdate(
//       { tableId, status: 'pending' }, // Adjust query if needed
//       {
//         items,
//         paymentMethod,
//         totalAmount: items.reduce((acc, item) => acc + item.price, 0),
//         status: 'completed',
//         orderEndTime: new Date() 
//       },
//       { new: true } 
//     );

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found or already completed.' });
//     }

//     const change = amountReceived - order.totalAmount;
//     res.json({ order, change });
//   } catch (error) {
//     console.error('Error during checkout:', error);
//     res.status(500).json({ message: 'Error during checkout', error });
//   }
// });

// Checkout route
router.post('/checkout', async (req, res) => {
  try {
    const { tableId, items, paymentMethod, amountReceived } = req.body;
    
    // Validate that amountReceived is a number and greater than or equal to total amount
    const totalAmount = items.reduce((acc, item) => acc + item.price, 0);
    const amount = parseFloat(amountReceived);
    
    if (isNaN(amount) || amount < totalAmount) {
      return res.status(400).json({ message: 'Insufficient payment amount.' });
    }
    
    const change = amount - totalAmount;

    // Find and update the order
    const order = await Order.findOneAndUpdate(
      { tableId, status: 'pending' },
      {
        items,
        paymentMethod,
        totalAmount,
        status: 'completed',
        orderEndTime: new Date(),
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found or already completed.' });
    }

    res.json({ order, change });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ message: 'Error during checkout', error });
  }
});




module.exports = router;
