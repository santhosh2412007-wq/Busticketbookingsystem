const express = require('express');
const db = require('../db');

const router = express.Router();

const routeQuery = `
  SELECT
    r.id,
    r.departure_time,
    r.arrival_time,
    r.fare,
    r.travel_date,
    b.bus_name,
    b.bus_number,
    b.bus_type,
    b.total_seats,
    sc.name AS source_city,
    dc.name AS destination_city,
    (SELECT COUNT(*) FROM bookings bk WHERE bk.route_id = r.id AND bk.booking_status = 'confirmed') AS booked_count
  FROM routes r
  JOIN buses b ON r.bus_id = b.id
  JOIN cities sc ON r.source_city_id = sc.id
  JOIN cities dc ON r.destination_city_id = dc.id
`;

router.get('/city', (req, res) => {
  const { city, date } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City name is required.' });
  }

  let sql = `${routeQuery} WHERE sc.name = ? OR dc.name = ?`;
  const params = [city, city];

  if (date) {
    sql += ' AND r.travel_date = ?';
    params.push(date);
  }

  sql += ' ORDER BY r.travel_date, r.departure_time';

  const routes = db.prepare(sql).all(...params);
  const results = routes.map((route) => ({
    ...route,
    direction: route.source_city === city ? 'departure' : 'arrival',
    available_seats: route.total_seats - route.booked_count,
  }));

  res.json(results);
});

router.get('/search', (req, res) => {
  const { source, destination, date } = req.query;

  if (!source || !destination) {
    return res.status(400).json({ error: 'Source and destination are required.' });
  }

  let sql = `${routeQuery} WHERE sc.name = ? AND dc.name = ?`;
  const params = [source, destination];

  if (date) {
    sql += ' AND r.travel_date = ?';
    params.push(date);
  }

  sql += ' ORDER BY r.departure_time';

  const routes = db.prepare(sql).all(...params);
  const results = routes.map((route) => ({
    ...route,
    available_seats: route.total_seats - route.booked_count,
  }));

  res.json(results);
});

router.get('/:id', (req, res) => {
  const route = db
    .prepare(`${routeQuery} WHERE r.id = ?`)
    .get(req.params.id);

  if (!route) {
    return res.status(404).json({ error: 'Route not found.' });
  }

  const bookedSeats = db
    .prepare(`
      SELECT seat_numbers FROM bookings
      WHERE route_id = ? AND booking_status = 'confirmed'
    `)
    .all(req.params.id)
    .flatMap((b) => b.seat_numbers.split(',').map(Number));

  res.json({
    ...route,
    available_seats: route.total_seats - route.booked_count,
    booked_seats: bookedSeats,
  });
});

module.exports = router;
