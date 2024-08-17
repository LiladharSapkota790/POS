// src/components/Checkout.js
import React, { useState } from 'react';
import api from '../api/api';

const Checkout = ({ selectedTable, orderItems, onCheckoutComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');

  const handleConfirmCheckout = () => {
    const totalCharge = orderItems.reduce((acc, item) => acc + item.price, 0);
    const cash = parseFloat(cashReceived);
    const change = cash - totalCharge;

    if (cash >= totalCharge) {
      api.post('/checkout', {
        table: selectedTable._id,
        items: orderItems,
        paymentMethod,
        amountReceived: cash,
        change: change
      })
        .then(response => {
          onCheckoutComplete();
        })
        .catch(error => console.error("There was an error during checkout!", error));
    } else {
      alert('Insufficient cash. Please enter a valid amount.');
    }
  };

  return (
    <div className="checkout-modal">
      <h3>Checkout Details</h3>
      <p>Total Charge: ${orderItems.reduce((acc, item) => acc + item.price, 0)}</p>
      <label>
        Cash Received:
        <input
          type="number"
          value={cashReceived}
          onChange={e => setCashReceived(e.target.value)}
        />
      </label>
      <p>Change: ${parseFloat(cashReceived) - orderItems.reduce((acc, item) => acc + item.price, 0)}</p>
      <button onClick={handleConfirmCheckout}>Confirm Checkout</button>
      <button onClick={onCheckoutComplete}>Cancel</button>
    </div>
  );
};

export default Checkout;
