const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create a new order
router.post('/', async (req, res) => {
  const { tableId, items, paymentMethod } = req.body;

  try {
    const order = new Order({
      tableId,
      items,
      paymentMethod
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error });
  }
});

// Get an order by table ID (for orders with 'pending' status)
router.get('/table/:tableId', async (req, res) => {
  const { tableId } = req.params;

  try {
    const order = await Order.findOne({ tableId, status: 'pending' }).populate('tableId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found for this table' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order', error });
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

// Update an order
router.put('/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { items } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.items = items;
    order.totalAmount = items.reduce((sum, item) => sum + item.price, 0);

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Error updating order', error });
  }
});

module.exports = router;
