const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'bus_booking.db');
if (fs.existsSync(dbPath)) {
  try {
    fs.unlinkSync(dbPath);
    console.log('Removed existing database.');
  } catch {
    console.error('Could not delete database. Stop the backend server first (Ctrl+C), then run: npm run reseed');
    process.exit(1);
  }
}

require('./seed');
