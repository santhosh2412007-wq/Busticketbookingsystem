const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const { email } = req.query;

  let sql = `
    SELECT
      bk.id,
      bk.passenger_name,
      bk.passenger_email,
      bk.passenger_phone,
      bk.seat_numbers,
      bk.total_fare,
      bk.booking_status,
      bk.booked_at,
      r.departure_time,
      r.arrival_time,
      r.travel_date,
      b.bus_name,
      b.bus_number,
      sc.name AS source_city,
      dc.name AS destination_city
    FROM bookings bk
    JOIN routes r ON bk.route_id = r.id
    JOIN buses b ON r.bus_id = b.id
    JOIN cities sc ON r.source_city_id = sc.id
    JOIN cities dc ON r.destination_city_id = dc.id
  `;

  if (email) {
    sql += ' WHERE bk.passenger_email = ? ORDER BY bk.booked_at DESC';
    return res.json(db.prepare(sql).all(email));
  }

  sql += ' ORDER BY bk.booked_at DESC';
  res.json(db.prepare(sql).all());
});

router.post('/', (req, res) => {
  const { route_id, passenger_name, passenger_email, passenger_phone, seat_numbers } = req.body;

  if (!route_id || !passenger_name || !passenger_email || !passenger_phone || !seat_numbers?.length) {
    return res.status(400).json({ error: 'All booking fields are required.' });
  }

  const route = db
    .prepare(`
      SELECT r.*, b.total_seats,
        (SELECT COUNT(*) FROM bookings bk WHERE bk.route_id = r.id AND bk.booking_status = 'confirmed') AS booked_count
      FROM routes r
      JOIN buses b ON r.bus_id = b.id
      WHERE r.id = ?
    `)
    .get(route_id);

  if (!route) {
    return res.status(404).json({ error: 'Route not found.' });
  }

  const available = route.total_seats - route.booked_count;
  if (seat_numbers.length > available) {
    return res.status(400).json({ error: 'Not enough seats available.' });
  }

  const bookedSeats = db
    .prepare(`
      SELECT seat_numbers FROM bookings
      WHERE route_id = ? AND booking_status = 'confirmed'
    `)
    .all(route_id)
    .flatMap((b) => b.seat_numbers.split(',').map(Number));

  const conflict = seat_numbers.find((s) => bookedSeats.includes(s));
  if (conflict) {
    return res.status(400).json({ error: `Seat ${conflict} is already booked.` });
  }

  const total_fare = route.fare * seat_numbers.length;
  const seatStr = seat_numbers.sort((a, b) => a - b).join(',');

  const result = db
    .prepare(`
      INSERT INTO bookings (route_id, passenger_name, passenger_email, passenger_phone, seat_numbers, total_fare)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .run(route_id, passenger_name, passenger_email, passenger_phone, seatStr, total_fare);

  res.status(201).json({
    id: result.lastInsertRowid,
    message: 'Booking confirmed successfully!',
    total_fare,
    seat_numbers: seatStr,
  });
});

router.delete('/:id', (req, res) => {
  const result = db
    .prepare("UPDATE bookings SET booking_status = 'cancelled' WHERE id = ? AND booking_status = 'confirmed'")
    .run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Booking not found or already cancelled.' });
  }

  res.json({ message: 'Booking cancelled successfully.' });
});

module.exports = router;
