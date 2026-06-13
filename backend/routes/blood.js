const express = require('express');
const bloodService = require('../services/bloodService');

const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const { bloodGroup, hospital } = req.query;
    const inventory = await bloodService.searchInventory({ bloodGroup, hospital });
    const grouped = inventory.reduce((acc, item) => {
      const hospitalName = item.hospitalName;
      if (!acc[hospitalName]) acc[hospitalName] = [];
      acc[hospitalName].push(item);
      return acc;
    }, {});
    res.json({ inventory: grouped });
  } catch (error) {
    res.status(500).json({ message: 'Unable to search blood inventory.', error: error.message });
  }
});

module.exports = router;
