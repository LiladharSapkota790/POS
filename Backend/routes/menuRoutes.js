const express = require('express');
const router = express.Router();
const MenuItem = require('../models/Menu');

// GET all menu items
router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new menu item (if needed)
router.post('/', async (req, res) => {
  const { name, price, category } = req.body;
  try {
    const newMenuItem = new MenuItem({ name, price, category });
    await newMenuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
