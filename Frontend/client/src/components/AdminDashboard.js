// src/pages/AdminDashboard.js
import React from 'react';
import OrderSummary from './OrederSummary';
import OrderDetailTable from './OrderDetailTable';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <OrderSummary />
      <OrderDetailTable />
      {/* Add other admin dashboard components here */}
    </div>
  );
};

export default AdminDashboard;
