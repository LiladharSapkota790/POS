import React, { useState, useEffect } from 'react';
import api from '../api/api';
import './MenuView.css'; // Import the CSS file

function MenuView() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    api.get('/menu')
      .then(response => {
        setMenuItems(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the menu!", error);
      });
  }, []);

  // Group menu items by category
  const categorizedMenu = menuItems.reduce((acc, item) => {
    const { category } = item;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <div className="menu-view">
      <h2>Menu</h2>
      {Object.keys(categorizedMenu).map(category => (
        <div key={category} className="category-section">
          <h3 className="category-title">{category}</h3>
          <div className="menu-grid">
            {categorizedMenu[category].map(item => (
              <div key={item._id} className="menu-item">
                <div className="item-name">{item.name}</div>
                <div className="item-price">${item.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MenuView;
