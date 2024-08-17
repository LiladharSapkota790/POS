import React, { useState, useEffect } from 'react';
import api from '../api/api';

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

  return (
    <div>
      <h2>Menu</h2>
      <ul>
        {menuItems.map(item => (
          <li key={item._id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default MenuView;
