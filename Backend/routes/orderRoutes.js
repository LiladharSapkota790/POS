const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// // Create a new order
// router.post('/', async (req, res) => {
//   const { tableId, items, paymentMethod } = req.body;

//   try {
//     const order = new Order({
//       tableId,
//       items,
//       paymentMethod
//     });

//     await order.save();
//     res.status(201).json(order);
//   } catch (error) {
//     console.error('Error creating order:', error);
//     res.status(500).json({ message: 'Error creating order', error });
//   }
// });




// Create a new order
router.post('/', async (req, res) => {
  const { tableId, items, paymentMethod } = req.body;

  // Calculate total amount
  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

  try {
    const order = new Order({
      tableId,
      items,
      paymentMethod,
      totalAmount
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error });
  }
});

// Get all pending orders for a table
// Get all pending orders for a table
router.get('/pending/:tableId', async (req, res) => {
  try {
    const { tableId } = req.params;
  
    const orders = await Order.find({ tableId, status: 'pending' }); 
   
    res.json(orders);
  } catch (error) {
    console.error('Failed to fetch pending orders:', error); // Log error details
    res.status(500).json({ error: 'Failed to fetch pending orders' });
  }
});


// Get all orders for a specific table
router.get('/:tableId', async (req, res) => {
  const { tableId } = req.params;

  try {
    const orders = await Order.find({ tableId });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

// // Update an order
// router.put('/:orderId', async (req, res) => {
//   const { orderId } = req.params;
//   const { items } = req.body;

//   try {
//     const order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     order.items = items;
//     order.totalAmount = items.reduce((sum, item) => sum + item.price, 0);

//     await order.save();
//     res.status(200).json(order);
//   } catch (error) {
//     console.error('Error updating order:', error);
//     res.status(500).json({ message: 'Error updating order', error });
//   }
// });

// Update an order
router.put('/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { items } = req.body;

  // Calculate total amount
  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.items = items;
    order.totalAmount = totalAmount;

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Error updating order', error });
  }
});



// // Get order summary for a specific date range
// router.get('/summary', async (req, res) => {
//   const { startDate, endDate } = req.query; // Expecting start and end date in query parameters

//   try {
//     const summary = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           totalSales: { $sum: "$totalAmount" },
//           totalOrders: { $count: {} }
//         }
//       }
//     ]);

//     res.status(200).json(summary[0] || { totalSales: 0, totalOrders: 0 });
//   } catch (error) {
//     console.error('Error fetching order summary:', error);
//     res.status(500).json({ message: 'Error fetching order summary', error });
//   }
// });













module.exports = router;
