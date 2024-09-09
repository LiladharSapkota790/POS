import React, { useState, useEffect } from 'react';
import './CheckoutView.css'; // Add your styles for the modal here

const CheckoutView = ({ orderItems, onCheckoutComplete, onClose, tableNumber }) => {
  const [amountReceived, setAmountReceived] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [error, setError] = useState('');

  useEffect(() => {
    // Reset state when the modal is opened
    setAmountReceived('');
    setPaymentMethod('cash');
    setError('');
  }, [orderItems]);

  const totalCharge = orderItems.reduce((acc, item) => acc + item.price, 0);
  const amount = parseFloat(amountReceived);
  const change = !isNaN(amount) && amount >= totalCharge ? amount - totalCharge : 0;

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === 'cash') {
      setAmountReceived('');
      setError(''); // Clear error when switching to cash
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmountReceived(value);

    const amount = parseFloat(value);
    if (!isNaN(amount) && amount >= totalCharge) {
      setError(''); // Clear error if amount is sufficient
    } else {
      setError('Insufficient amount. Please enter more.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'cash') {
      const amount = parseFloat(amountReceived);
      if (isNaN(amount) || amount < totalCharge) {
        setError('Insufficient amount. Please enter more.');
        return;
      }
      setError('');
      onCheckoutComplete(amount);
      onClose(); // Close the modal after checkout
    } else if (paymentMethod === 'card') {
      // Assuming card payment doesn't need amount received
      onCheckoutComplete(totalCharge);
      onClose(); // Close the modal after checkout
    } else {
      setError('Please select a payment method.');
    }
  };

  // New function to handle mouse leave
  const handleMouseLeave = () => {
    onClose(); // Close the modal when mouse leaves
  };

  return (
    // <div
    //   className={`modal ${orderItems.length > 0 ? 'show' : ''}`}
    //   onMouseLeave={handleMouseLeave} // Add mouse leave handler
    // >
    //   <div className="modal-content">
    //     <h3>Checkout</h3>
    //     <div>
    //       <p><strong>Table Number:</strong> {tableNumber}</p>
    //       <p><strong>Total Amount to Pay:</strong> ${totalCharge.toFixed(2)}</p>
    //     </div>
    //     <form onSubmit={handleSubmit}>
    //       <div>
    //         <label>
    //           <input
    //             type="radio"
    //             name="paymentMethod"
    //             value="cash"
    //             checked={paymentMethod === 'cash'}
    //             onChange={() => handlePaymentMethodChange('cash')}
    //           />
    //           Cash
    //         </label>
    //         <label>
    //           <input
    //             type="radio"
    //             name="paymentMethod"
    //             value="card"
    //             checked={paymentMethod === 'card'}
    //             onChange={() => handlePaymentMethodChange('card')}
    //           />
    //           Card
    //         </label>
    //       </div>
    //       {paymentMethod === 'cash' && (
    //         <div>
    //           <label>
    //             Amount Received:
    //             <input
    //               type="number"
    //               value={amountReceived}
    //               onChange={handleAmountChange} // Use the new function
    //               step="0.01"
    //               min="0"
    //               required
    //             />
    //           </label>
    //           {amount >= totalCharge && (
    //             <div>
    //               Change: ${change.toFixed(2)}
    //             </div>
    //           )}
    //         </div>
    //       )}
    //       {error && <p style={{ color: 'red' }}>{error}</p>}
    //       <button type="submit">Complete Checkout</button>
    //       <button type="button" onClick={onClose}>Close</button>
    //     </form>
    //   </div>
    // </div>


<div className="modal-content">
  <button className="modal-close" onClick={onClose}>&times;</button> {/* Close button */}
  <h3>Checkout</h3>
  <div>
    <p><strong>Table Number:</strong> {tableNumber}</p>
    <p><strong>Total Amount to Pay:</strong> ${totalCharge.toFixed(2)}</p>
  </div>
  <form onSubmit={handleSubmit}>
    <div>
      <label>
        <input
          type="radio"
          name="paymentMethod"
          value="cash"
          checked={paymentMethod === 'cash'}
          onChange={() => handlePaymentMethodChange('cash')}
        />
        Cash
      </label>
      <label>
        <input
          type="radio"
          name="paymentMethod"
          value="card"
          checked={paymentMethod === 'card'}
          onChange={() => handlePaymentMethodChange('card')}
        />
        Card
      </label>
    </div>
    {paymentMethod === 'cash' && (
      <div>
        <label>
          Amount Received:
          <input
            type="number"
            value={amountReceived}
            onChange={handleAmountChange}
            step="0.01"
            min="0"
            required
          />
        </label>
        {amount >= totalCharge && (
          <div>
            Change: ${change.toFixed(2)}
          </div>
        )}
      </div>
    )}
    {error && <p className="error">{error}</p>}
    <button type="submit">Complete Checkout</button>
    <button type="button" onClick={onClose}>Close</button>
  </form>
</div>














  );
};

export default CheckoutView;
