import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderDetailTable.css';

const OrderDetailTable = () => {
  const [orderSummary, setOrderSummary] = useState([]);

  useEffect(() => {
    // Fetch order summary from the backend
    const fetchOrderSummary = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orderDetails');
        console.log("Details", response.data);
        setOrderSummary(response.data);
      } catch (error) {
        console.error('Error fetching order summary:', error);
      }
    };

    fetchOrderSummary();
  }, []);

  return (
    <div>
      <h2>Order Details</h2>
      <table>
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Table Number</th>
            <th>Food Items Ordered</th>
            <th>Total Amount</th>
            <th>Payment Status</th>
            <th>Payment Method</th>
          </tr>
        </thead>
        <tbody>
          {orderSummary.map((order) => (
            <tr key={order.orderNumber}>
              <td>{order.orderNumber}</td>
              <td>{order.tableNo}</td>
              <td>{order.items}</td>
              <td>${order.totalAmount.toFixed(2)}</td>
              <td>{order.paymentStatus}</td>
              <td>{order.paymentMethod}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetailTable;

