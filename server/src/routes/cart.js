const express = require('express');
const Cart = require('../models/Cart');

const router = express.Router();

// GET /api/cart/:sessionId - fetch cart for a session
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const cart = await Cart.findOne({ sessionId });
    res.json(cart || { sessionId, items: [] });
  } catch (error) {
    console.error('Error fetching cart', error);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

// POST /api/cart - create or update cart
router.post('/', async (req, res) => {
  try {
    const { sessionId, items } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: 'sessionId is required' });
    }
    const cart = await Cart.findOneAndUpdate(
      { sessionId },
      { sessionId, items },
      { new: true, upsert: true }
    );
    res.json(cart);
  } catch (error) {
    console.error('Error saving cart', error);
    res.status(400).json({ message: 'Failed to save cart' });
  }
});

module.exports = router;


