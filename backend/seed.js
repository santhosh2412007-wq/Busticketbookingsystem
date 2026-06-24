const db = require('./db');

const cityCount = db.prepare('SELECT COUNT(*) as count FROM cities').get().count;
if (cityCount > 0) {
  console.log('Database already seeded.');
  process.exit(0);
}

const insertCity = db.prepare('INSERT INTO cities (name) VALUES (?)');
const cities = ['Chennai', 'Bangalore', 'Hyderabad', 'Mumbai', 'Delhi', 'Pune', 'Coimbatore'];
const cityIds = {};
for (const city of cities) {
  const result = insertCity.run(city);
  cityIds[city] = result.lastInsertRowid;
}

const insertBus = db.prepare(
  'INSERT INTO buses (bus_name, bus_number, bus_type, total_seats) VALUES (?, ?, ?, ?)'
);
const buses = [
  ['VRL Travels', 'TN-01-AB-1234', 'AC Sleeper', 40],
  ['Orange Tours', 'KA-05-CD-5678', 'AC Seater', 45],
  ['SRS Travels', 'TN-07-EF-9012', 'Non-AC Seater', 50],
  ['KPN Travels', 'TN-09-GH-3456', 'AC Sleeper', 36],
  ['Parveen Travels', 'TN-11-IJ-7890', 'AC Seater', 42],
  ['Rajesh Travels', 'TN-13-KL-2345', 'AC Sleeper', 40],
  ['National Travels', 'MH-12-MN-6789', 'AC Seater', 48],
  ['Sharma Travels', 'DL-01-ST-4567', 'Non-AC Seater', 52],
];
const busIds = [];
for (const bus of buses) {
  const result = insertBus.run(...bus);
  busIds.push(result.lastInsertRowid);
}

const today = new Date();
const formatDate = (offset) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};

const insertRoute = db.prepare(`
  INSERT INTO routes (bus_id, source_city_id, destination_city_id, departure_time, arrival_time, fare, travel_date)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const routeDefs = [
  // Chennai
  [0, 'Chennai', 'Bangalore', '22:00', '06:00', 850],
  [2, 'Chennai', 'Coimbatore', '06:00', '11:30', 450],
  [2, 'Chennai', 'Mumbai', '18:00', '14:00', 1800],
  [3, 'Chennai', 'Hyderabad', '20:30', '08:00', 950],
  [4, 'Chennai', 'Pune', '19:00', '12:00', 1400],
  [5, 'Chennai', 'Delhi', '17:00', '14:00', 2200],
  // Bangalore
  [1, 'Bangalore', 'Hyderabad', '21:30', '07:00', 1200],
  [0, 'Bangalore', 'Chennai', '23:00', '07:00', 850],
  [3, 'Bangalore', 'Mumbai', '20:00', '10:00', 1500],
  [2, 'Bangalore', 'Coimbatore', '07:00', '14:00', 550],
  [4, 'Bangalore', 'Delhi', '18:30', '16:00', 2000],
  [5, 'Bangalore', 'Pune', '22:00', '12:00', 1300],
  // Hyderabad
  [1, 'Hyderabad', 'Bangalore', '22:30', '08:00', 1100],
  [3, 'Hyderabad', 'Chennai', '21:00', '08:30', 950],
  [6, 'Hyderabad', 'Mumbai', '20:00', '10:00', 1600],
  [4, 'Hyderabad', 'Pune', '23:00', '13:00', 1400],
  [7, 'Hyderabad', 'Delhi', '19:00', '14:00', 2100],
  // Mumbai
  [3, 'Mumbai', 'Pune', '23:00', '04:30', 600],
  [6, 'Mumbai', 'Bangalore', '18:00', '12:00', 1500],
  [2, 'Mumbai', 'Chennai', '16:00', '14:00', 1800],
  [1, 'Mumbai', 'Hyderabad', '19:30', '09:00', 1600],
  [5, 'Mumbai', 'Delhi', '20:00', '14:00', 1900],
  // Delhi
  [5, 'Delhi', 'Pune', '20:00', '12:00', 1700],
  [7, 'Delhi', 'Mumbai', '18:00', '12:00', 1900],
  [0, 'Delhi', 'Bangalore', '17:30', '14:00', 2000],
  [3, 'Delhi', 'Hyderabad', '19:00', '12:00', 2100],
  [4, 'Delhi', 'Chennai', '16:00', '14:00', 2200],
  // Pune
  [3, 'Pune', 'Mumbai', '06:00', '11:30', 600],
  [1, 'Pune', 'Bangalore', '21:00', '11:00', 1300],
  [4, 'Pune', 'Hyderabad', '22:00', '12:00', 1400],
  [6, 'Pune', 'Chennai', '18:00', '12:00', 1400],
  [2, 'Pune', 'Delhi', '19:00', '13:00', 1700],
  // Coimbatore
  [2, 'Coimbatore', 'Chennai', '14:00', '19:30', 450],
  [1, 'Coimbatore', 'Bangalore', '08:00', '15:00', 550],
  [4, 'Coimbatore', 'Hyderabad', '20:00', '10:00', 1200],
  [5, 'Coimbatore', 'Mumbai', '17:00', '14:00', 1900],
];

for (const dayOffset of [0, 1, 2]) {
  for (const [busIdx, from, to, dep, arr, fare] of routeDefs) {
    insertRoute.run(
      busIds[busIdx],
      cityIds[from],
      cityIds[to],
      dep,
      arr,
      fare,
      formatDate(dayOffset)
    );
  }
}

console.log('Database seeded successfully with cities, buses, and routes.');
