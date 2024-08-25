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

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleString() : 'In Progress';
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
            console.log('Order End Time:', order.orderEndTime); // Log the orderEndTime here
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
