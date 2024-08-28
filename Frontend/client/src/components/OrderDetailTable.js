import React, { useEffect, useState } from 'react';

import { fetchOrderSummary } from '../api/api';
import './OrderDetailTable.css';

const OrderDetailTable = () => {
  const [orderSummary, setOrderSummary] = useState([]);
  const [error, setError] = useState(null); // Add error state

  // Fetch order summary from the backend
  useEffect(() => {
    const loadOrderSummary = async () => {
      try {
        const data = await fetchOrderSummary(); // Call the function from the API
       
        setOrderSummary(data);
      } catch (error) {
        console.error('Error fetching order summary:', error);
        setError('Failed to fetch order summary.'); // Set error message
      }
    };

    loadOrderSummary();
  }, []);

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleString() : 'NOT PAID';
  };

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
            <th>Order Start Time</th>
            <th>Order End Time</th>
          </tr>
        </thead>
        <tbody>
          {orderSummary.map((order, index) => {
         
            return (
              <tr key={order.orderNumber}>
                <td>{index + 1}</td> 
                <td>{order.tableNo}</td>
                <td>{order.items}</td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>{order.paymentStatus}</td>
                <td>{order.paymentMethod}</td>
                <td>{formatDate(order.orderStartTime)}</td> 
                <td>{formatDate(order.orderEndTime)}</td> 
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    
  );
};

export default OrderDetailTable;
