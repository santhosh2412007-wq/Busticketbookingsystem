const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const cities = db.prepare('SELECT id, name FROM cities ORDER BY name').all();
  res.json(cities);
});

module.exports = router;
