import React, { useState, useEffect } from 'react';
import api, { getPendingOrders } from '../api/api';
import Checkout from './CheckoutView'; // Import the Checkout component
import MenuView from './MenuView'; // Import the MenuView component
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
      .then(response => {
        setTables(response.data);
        // Set the first table as the default selected table
        if (response.data.length > 0) {
          const defaultTable = response.data[0];
          setSelectedTable(defaultTable);
          // Fetch pending orders for the default selected table
          getPendingOrders(defaultTable._id)
            .then(response => {
              setOrderItems(response.data.flatMap(order => order.items));
            })
            .catch(error => {
              console.error("There was an error fetching orders!", error);
            });
        }
      })
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
      setSelectedTable(table);
      // Fetch pending orders for the selected table
      getPendingOrders(table._id)
        .then(response => {
          setOrderItems(response.data.flatMap(order => order.items));
        })
        .catch(error => {
          console.error("There was an error fetching orders!", error);
        });
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
      paymentMethod: paymentMethod || 'Unknown',
      totalAmount: orderItems.reduce((acc, item) => acc + item.price, 0)
    };

    try {
      const response = await placeOrder(orderData);
      const newOrder = response;

      if (!newOrder || !newOrder.tableId || !newOrder.items) {
        throw new Error('No valid order data received from server');
      }

      setOrderSuccess('Order placed successfully!');

      setOrdersByTable(prevOrders => ({
        ...prevOrders,
        [selectedTable._id]: [
          ...(prevOrders[selectedTable._id] || []),
          newOrder
        ]
      }));
    } catch (error) {
      console.error("Error placing the order:", error.message);
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
      status: "Completed",
    })
      .then(response => {
        setOrderSuccess('Checkout completed successfully!');
        setShowCheckout(false);
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

  const processMenuData = (data) => {
    // Assuming data is an array with one object
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
      const [menuObject] = data;
      const processedData = {};
      for (const [category, subcategories] of Object.entries(menuObject)) {
        if (category !== '_id') {
          processedData[category] = subcategories;
        }
      }
      return processedData;
    }
    return {};
  };

  const groupedMenuItems = processMenuData(menuItems);



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
                      {item.name} - ${item.price.toFixed(2)} <br />
                      Comment: {item.comment || 'No comment'}
                      <button onClick={() => handleRemoveOrderItem(index)}>Remove</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No items in the order.</p>
              )}
            </div>
            <div className='placeorder-button-container'> 
              <button className='checkout-button' onClick={handleCheckout}>Checkout</button>
              <button className="place-order-button" onClick={handlePlaceOrder}>Place Order</button>
            </div>
          </div>
        )}
      </div>

      <div className="right-panel">
        {selectedTable ? (
          <MenuView
            groupedMenuItems={groupedMenuItems}
            handleMenuItemClick={handleMenuItemClick}
            selectedMenuItem={selectedMenuItem}
            handleAddOrderItem={handleAddOrderItem}
            comment={comment}
            setComment={setComment}
          />
        ) : (
          <div className='place-order-button'>Select Any table to See Menu</div>
        )}
      </div>

      {showCheckout && (
        <Checkout
          table={selectedTable}
          onCheckoutComplete={handleCheckoutComplete}
          orderItems={orderItems}
          onClose={() => setShowCheckout(false)} 
          tableNumber={selectedTable.number}
        />
      )}

      {orderSuccess && (
        <Alert variant={orderSuccess.includes('success') ? 'success' : 'danger'}>
          {orderSuccess}
        </Alert>
      )}
    </div>
  );
};

export default TableView;
