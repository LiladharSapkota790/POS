import React, { useState, useEffect } from 'react';
import api from '../api/api';
import Checkout from './CheckoutView'; // Import the Checkout component
import './TableView.css';
import { placeOrder } from '../api/api';

const TableView = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
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
      .then(response => {
        console.log('Tables:', response.data); // Log tables for debugging
        setTables(response.data);
      })
      .catch(error => console.error("There was an error fetching tables!", error));

    api.get('/menu')
      .then(response => {
        console.log('Menu Items:', response.data); // Log menu items for debugging
        setMenuItems(response.data);
      })
      .catch(error => console.error("There was an error fetching menu items!", error));
  }, []);

  const handleTableSelect = (table) => {
    if (selectedTable && selectedTable._id === table._id) {
      // Deselect the table if the same table is clicked again
      setSelectedTable(null);
      setOrderItems([]); // Clear order items when table is deselected
    } else {
      // Fetch orders for the selected table
      api.get(`/orders/${table._id}`)
        .then(response => {
          console.log('Orders for Table:', response.data); // Log orders for debugging
          if (response.data.status === 'unpaid') {
            // Show the last unpaid order with options to modify it
            setOrderItems(response.data.items || []);
          } else {
            // Show an empty order list for a new order
            setOrderItems([]);
          }
          setSelectedTable(table);
        })
        .catch(error => console.error("There was an error fetching orders for the table!", error));
    }
  };

  const handleMenuItemClick = (item) => {
    console.log('Menu Item Selected:', item); // Log selected menu item for debugging
    setSelectedMenuItem(item);
    setComment('');
  };

  const handleAddOrderItem = () => {
    if (selectedMenuItem) {
      setOrderItems([...orderItems, { ...selectedMenuItem, comment }]);
      setSelectedMenuItem(null);
    } else if (newOrderItemName && newOrderItemPrice) {
      setOrderItems([...orderItems, { name: newOrderItemName, price: parseFloat(newOrderItemPrice), comment }]);
      setNewOrderItemName('');
      setNewOrderItemPrice('');
    }
    setComment('');
  };

  const handleRemoveOrderItem = (index) => {
    const updatedItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(updatedItems);
  };

  const handlePlaceOrder = async () => {
    if (!selectedTable) {
      setOrderSuccess('No table selected.');
      return;
    }
  
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      setOrderSuccess('No items in the order.');
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
  
    console.log('Order Data:', orderData);
  
    try {
      const result = await placeOrder(orderData);
      console.log('Order placed successfully:', result);
      setOrderSuccess('Order placed successfully!');
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
      table: selectedTable._id,
      items: orderItems,
      paymentMethod,
      amountReceived: amountReceived,
      change: change
    })
      .then(response => {
        setOrderSuccess('Checkout completed successfully!');
        setShowCheckout(false);
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

  return (
    <div>
      <h2>Tables</h2>
      {tables.length > 0 ? (
        <div>
          <h3>Select a Table</h3>
          {tables.map(table => (
            <button
              key={table._id}
              onClick={() => handleTableSelect(table)}
              style={{ margin: '5px' }}
            >
              Table {table.number}
            </button>
          ))}
        </div>
      ) : (
        <p>No tables available</p>
      )}

      {selectedTable && (
        <div>
          <h3>Table {selectedTable.number} - Manage Order</h3>
          <div className="menu-container">
            {Object.entries(groupedMenuItems).map(([category, items], index) => (
              <div className="category-section" key={index}>
                <h4>{category}</h4>
                <ul>
                  {items.map(item => (
                    <li key={item._id}>
                      <button onClick={() => handleMenuItemClick(item)}>
                        {item.name} - ${item.price}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {selectedMenuItem && (
            <div>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Add a comment (optional)"
              />
              <button onClick={handleAddOrderItem}>Add Item</button>
            </div>
          )}

          <div>
            <input
              type="text"
              value={newOrderItemName}
              onChange={e => setNewOrderItemName(e.target.value)}
              placeholder="Add new order item"
            />
            <input
              type="number"
              value={newOrderItemPrice}
              onChange={e => setNewOrderItemPrice(e.target.value)}
              placeholder="Price"
            />
            <button onClick={handleAddOrderItem}>Add Custom Item</button>
          </div>

          <div>
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

          <div>
            <label>
              Payment Method:
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
              </select>
            </label>
          </div>
          <button onClick={handleCheckout}>Checkout</button>
          <button onClick={handlePlaceOrder}>Place Order</button>
        </div>
      )}

      {showCheckout && (
        <Checkout
          orderItems={orderItems}
          onCheckoutComplete={handleCheckoutComplete}
        />
      )}

      {orderSuccess && <p>{orderSuccess}</p>}
    </div>
  );
};

export default TableView;
