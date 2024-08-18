import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderSummary = () => {
  const [summary, setSummary] = useState({ totalSales: 0, totalOrders: 0 });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (startDate && endDate) {
      fetchSummary();
    }
  }, [startDate, endDate]);

  const fetchSummary = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/summary', {
        params: { startDate, endDate }
      });
      console.log('API Response:', response.data); // Log the response for debugging
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching order summary:', error);
    }
  };

  return (
    <div>
      <h2>Order Summary</h2>
      <div>
        <label>
          Start Date:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>
          End Date:
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <button onClick={fetchSummary}>Get Summary</button>
      </div>
      <div>
        <h3>Summary</h3>
        <p>Total Sales: ${summary.totalSales.toFixed(2)}</p>
        <p>Total Orders: {summary.totalOrders}</p>
      </div>
    </div>
  );
};

export default OrderSummary;
