import React, { useState } from 'react';
import './MenuView.css'; // Importing the CSS file for styling

const MenuView = ({ groupedMenuItems, handleMenuItemClick, selectedMenuItem, handleAddOrderItem, comment, setComment }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  // Function to filter menu items by selected category and subcategory
  const filterMenuItems = () => {
    if (!selectedCategory) return {};

    const categoryItems = groupedMenuItems[selectedCategory] || {};
    if (!selectedSubCategory) return categoryItems;

    return categoryItems[selectedSubCategory] || [];
  };

  const filteredItems = filterMenuItems();

  return (
    <div className="menu-view">
      {/* Main Category Selection */}
      <div className="main-category-nav">
        {Object.keys(groupedMenuItems).map(category => (
          <button
            key={`category-${category}`}
            onClick={() => {
              setSelectedCategory(category);
              setSelectedSubCategory('');
            }}
            className={selectedCategory === category ? 'active' : ''}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Subcategory Selection */}
      {selectedCategory && (
        <div className="subcategory-selection">
          {Object.keys(groupedMenuItems[selectedCategory] || {}).map(subCategory => (
            <button
              key={`subcategory-${subCategory}`}
              onClick={() => setSelectedSubCategory(subCategory)}
              className={selectedSubCategory === subCategory ? 'active' : ''}
            >
              {subCategory}
            </button>
          ))}
        </div>
      )}

      {/* Menu Items */}
      {selectedSubCategory && (
        <div className="menu-grid">
          {Array.isArray(filteredItems) && filteredItems.map(item => (
            <div key={item._id} className="menu-item">
              <button
                onClick={() => handleMenuItemClick(item)}
                className={`menu-item-button ${selectedMenuItem && selectedMenuItem._id === item._id ? 'active' : ''}`}
              >
                {item.name} - ${item.price.toFixed(2)}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuView;
