


const express = require('express');
const router = express.Router();
const Order = require('../models/Order');





// Get order summary based on date range
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Initialize query object
    let query = {};
    
    // Check if startDate and endDate are provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1); // Include the end date
      query.orderDate = { $gte: start, $lt: end };
    } else if (startDate) {
      const start = new Date(startDate);
      query.orderDate = { $gte: start, $lt: new Date(start.setDate(start.getDate() + 1)) };
    }

    const orders = await Order.find(query);

    // Calculate total sales and total orders
    const totalSales = orders.reduce((total, order) => total + order.totalAmount, 0);
    const totalOrders = orders.length;

    res.status(200).json({ totalSales, totalOrders });
  } catch (error) {
    console.error('Error fetching order summary:', error);
    res.status(500).json({ message: 'Error fetching order summary', error });
  }
});









// Get order summary for the admin dashboard
// router.get('/orderDetails', async (req, res) => {
//   try {
//     const { date } = req.query;
//     let query = {};
//     if (date) {
//       query.orderDate = {
//         $gte: new Date(date),
//         $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
//       };
//     }

//     const orders = await Order.find(query).populate('tableId');
//     const orderDetails = orders.map(order => ({
//       orderNumber: order._id,
//       tableNo: order.tableId ? order.tableId.number : 'N/A',
//       items: order.items.map(item => `${item.name} (${item.price})`).join(', '),
//       totalAmount: order.totalAmount,
//       paymentStatus: order.status,
//       paymentMethod: order.paymentMethod
//     }));
//     res.status(200).json(orderDetails);
//   } catch (error) {
//     console.error('Error fetching order summary:', error);
//     res.status(500).json({ message: 'Error fetching order summary', error });
//   }
// });



// Get order summary for the admin dashboard
router.get('/orderDetails', async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};
    if (date) {
      query.orderDate = {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
      };
    }

    const orders = await Order.find(query).populate('tableId');
   
    const orderDetails = orders.map(order => ({
      orderNumber: order.orderNumber, // Order number starting from 1
      tableNo: order.tableId ? order.tableId.number : 'N/A',
      items: order.items.map(item => `${item.name} (${item.price})`).join(', '),
      totalAmount: order.totalAmount,
      paymentStatus: order.status,
      paymentMethod: order.paymentMethod,
      orderStartTime: order.orderDate, // Assuming orderDate is the start time
      orderEndTime: order.orderEndTime// Add this field if it exists
    }));

    // Sort orders by orderDate in descending order to show the latest order first
    orderDetails.sort((a, b) => new Date(b.orderStartTime) - new Date(a.orderStartTime));

    res.status(200).json(orderDetails);
  } catch (error) {
    console.error('Error fetching order summary:', error);
    res.status(500).json({ message: 'Error fetching order summary', error });
  }
});













module.exports = router;
