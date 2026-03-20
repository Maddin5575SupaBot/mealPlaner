const express = require('express');
const router = express.Router();

// Placeholder for grocery list routes
// Currently grocery lists are generated from meal plans

router.get('/', (req, res) => {
  res.json({ message: 'Grocery list endpoints - use meal plans to generate lists' });
});

module.exports = router;