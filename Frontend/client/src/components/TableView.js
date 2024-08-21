import React, { useState, useEffect } from 'react';
import api from '../api/api';
import Checkout from './CheckoutView'; // Import the Checkout component
import './TableView.css';
import { placeOrder } from '../api/api';
import { Alert } from 'react-bootstrap';

const TableView = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [ordersByTable, setOrdersByTable] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [newOrderItemName, setNewOrderItemName] = useState('');
  const [newOrderItemPrice, setNewOrderItemPrice] = useState('');
  const [comment, setComment] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    // Fetch tables and menu items
    api.get('/tables')
      .then(response => setTables(response.data))
      .catch(error => console.error("There was an error fetching tables!", error));

    api.get('/menu')
      .then(response => setMenuItems(response.data))
      .catch(error => console.error("There was an error fetching menu items!", error));
  }, []);

  const handleTableSelect = (table) => {
    if (selectedTable && selectedTable._id === table._id) {
      setSelectedTable(null);
      setOrderItems([]);
    } else {
      // Load orders for the selected table
      const orders = ordersByTable[table._id] || [];
      setOrderItems(orders);
      setSelectedTable(table);
    }
  };

  const handleMenuItemClick = (item) => {
    setSelectedMenuItem(item);
    setComment('');
  };

  const handleAddOrderItem = () => {
    if (selectedMenuItem) {
      setOrderItems(prevOrderItems => [...prevOrderItems, { ...selectedMenuItem, comment }]);
      setSelectedMenuItem(null);
    } else if (newOrderItemName && newOrderItemPrice) {
      setOrderItems(prevOrderItems => [...prevOrderItems, { name: newOrderItemName, price: parseFloat(newOrderItemPrice), comment }]);
      setNewOrderItemName('');
      setNewOrderItemPrice('');
    }
    setComment('');
  };

  const handleRemoveOrderItem = (index) => {
    setOrderItems(prevOrderItems => prevOrderItems.filter((_, i) => i !== index));
  };

  const handlePlaceOrder = async () => {
    if (!selectedTable || orderItems.length === 0) {
      setOrderSuccess('Cannot place order. Ensure table is selected and items are added.');
      return;
    }
    const orderData = {
      tableId: selectedTable._id,
      items: orderItems.map(item => ({
        name: item.name || 'Unknown',
        comment: item.comment || '',
        price: item.price
      })),
      paymentMethod: paymentMethod || 'Unknown'
    };
    try {
      await placeOrder(orderData);
      setOrderSuccess('Order placed successfully!');
      // Update ordersByTable to reflect the new order
      setOrdersByTable(prevOrders => ({
        ...prevOrders,
        [selectedTable._id]: orderItems
      }));
    } catch (error) {
      console.error("Error placing the order:", error.response ? error.response.data : error.message);
      setOrderSuccess('Failed to place order.');
    }
  };

  const handleCheckout = () => {
    if (selectedTable) {
      setShowCheckout(true);
    } else {
      alert('Please select a table for checkout.');
    }
  };

  const handleCheckoutComplete = (amountReceived) => {
    if (!selectedTable || !selectedTable._id) {
      alert('Error: Table is not selected or invalid.');
      return;
    }
    const totalCharge = orderItems.reduce((acc, item) => acc + item.price, 0);
    const change = amountReceived - totalCharge;
    api.post('/checkout', {
      tableId: selectedTable._id,
      items: orderItems,
      paymentMethod,
      amountReceived: amountReceived,
      change: change,
      status:"Completed",
    })
      .then(response => {
        setOrderSuccess('Checkout completed successfully!');
        setShowCheckout(false);
        // Clear orders for the table after checkout
        setOrdersByTable(prevOrders => {
          const updatedOrders = { ...prevOrders };
          delete updatedOrders[selectedTable._id];
          return updatedOrders;
        });
        setOrderItems([]);
        setSelectedTable(null);
      })
      .catch(error => {
        console.error("There was an error during checkout!", error);
        setOrderSuccess('Failed to complete checkout.');
      });
  };

  const groupedMenuItems = menuItems.reduce((categories, item) => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
    return categories;
  }, {});



  // Automatically hide the alert after 3 seconds
  useEffect(() => {
    if (orderSuccess) {
      const timer = setTimeout(() => {
        setOrderSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [orderSuccess]);



  return (
    <div className="table-view-container">
      <div className="left-panel">
        <h3>Tables</h3>
        <ul className="table-list">
          {tables.map(table => (
            <li
              key={table._id}
              className={`table-item ${selectedTable && selectedTable._id === table._id ? 'selected' : ''}`}
              onClick={() => handleTableSelect(table)}
            >
              Table {table.number}
            </li>
          ))}
        </ul>

        {selectedTable && (
          <div>
            <h3>Table {selectedTable.number} - Manage Order</h3>
            <div className="order-summary">
              <h4>Order Items</h4>
              {orderItems.length > 0 ? (
                <ul>
                  {orderItems.map((item, index) => (
                    <li key={index}>
                      {item.name} - ${item.price} <br />
                      Comment: {item.comment || 'No comment'}
                      <button onClick={() => handleRemoveOrderItem(index)}>Remove</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No items in the order.</p>
              )}
            </div>
            <button onClick={handleCheckout}>Checkout</button>
            <button onClick={handlePlaceOrder}>Place Order</button>
          </div>
        )}
      </div>

      <div className="right-panel">
        {selectedTable ? (
          Object.entries(groupedMenuItems).map(([category, items], index) => (
            <div className="category-section" key={index}>
              <h4>{category}</h4>
              <ul>
                {items.map(item => (
                  <li key={item._id}>
                    <button
                      onClick={() => handleMenuItemClick(item)}
                      className="menu-item-button"
                    >
                      {item.name} - ${item.price}
                    </button>
                    {selectedMenuItem && selectedMenuItem._id === item._id && (
                      <div className="item-controls">
                        <textarea
                          value={comment}
                          onChange={e => setComment(e.target.value)}
                          placeholder="Add a comment (optional)"
                        />
                        <button onClick={handleAddOrderItem}>Add Item</button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
        <p>Please select a table.</p>
        )}
      </div>

      {showCheckout && (
        <Checkout
          orderItems={orderItems}
          onCheckoutComplete={handleCheckoutComplete}
          onClose={() => setShowCheckout(false)}
          tableNumber={selectedTable.number} 
          
        />
      )}

      {/* {orderSuccess && (
        <div className="alert">
          {orderSuccess}
        </div>
      )} */}
      {orderSuccess && (
        <Alert variant={orderSuccess.includes('success') ? 'success' : 'danger'} dismissible>
          {orderSuccess}
        </Alert>
      )}


    </div>
  );
};

export default TableView;
