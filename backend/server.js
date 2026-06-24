const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

require('./db');

const citiesRouter = require('./routes/cities');
const routesRouter = require('./routes/routes');
const bookingsRouter = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 5000;

const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bus Booking API is running' });
});

app.use('/api/cities', citiesRouter);
app.use('/api/routes', routesRouter);
app.use('/api/bookings', bookingsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
