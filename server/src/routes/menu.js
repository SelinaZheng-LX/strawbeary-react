const express = require('express');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

// GET /api/menu - list all menu items
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find({ isAvailable: true }).sort('name');
    res.json(items);
  } catch (error) {
    console.error('Error fetching menu items', error);
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
});

// POST /api/menu - create new menu item (basic admin)
router.post('/', async (req, res) => {
  try {
    const { name, description, price, imageURL, isAvailable, category } = req.body;
    const item = await MenuItem.create({
      name,
      description,
      price,
      imageURL,
      isAvailable,
      category,
    });
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating menu item', error);
    res.status(400).json({ message: 'Failed to create menu item' });
  }
});

module.exports = router;


