const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

// POST /api/orders - create new order
router.post('/', async (req, res) => {
  try {
    const { sessionId, items, total } = req.body;
    if (!sessionId || !Array.isArray(items) || typeof total !== 'number') {
      return res.status(400).json({ message: 'Invalid order payload' });
    }

    const order = await Order.create({
      sessionId,
      items: items.map((item) => ({
        dishName: item.dishName,
        price: item.price,
        quantity: item.quantity,
      })),
      total,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order', error);
    res.status(400).json({ message: 'Failed to create order' });
  }
});

// GET /api/orders/:sessionId - list orders for a session
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const orders = await Order.find({ sessionId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

module.exports = router;


