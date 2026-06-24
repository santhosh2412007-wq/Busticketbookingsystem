# BusGo - Bus Ticket Booking System

A full-stack web application for searching and booking bus tickets online.

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | React + Vite            |
| Backend  | Node.js + Express       |
| Database | SQLite                  |

## Features

- Search buses by source city, destination, and date
- View bus details, fare, and seat availability
- Interactive seat selection
- Book tickets with passenger details
- View and cancel bookings by email

## Project Structure

```
project/
├── backend/          # Express REST API
│   ├── db.js         # Database setup & schema
│   ├── server.js     # API server
│   ├── seed.js       # Sample data
│   └── routes/       # API endpoints
├── frontend/         # React web app
│   └── src/
│       ├── pages/    # Home, Search, Booking, My Bookings
│       └── api.js    # API client
└── README.md
```

## Setup & Run

### 1. Backend

```bash
cd backend
npm install
npm run seed
npm run dev
```

Backend runs at **http://localhost:5000**

### 2. Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:3000**

## API Endpoints

| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | `/api/cities`         | List all cities      |
| GET    | `/api/routes/search`  | Search bus routes    |
| GET    | `/api/routes/:id`     | Get route details    |
| POST   | `/api/bookings`       | Create a booking     |
| GET    | `/api/bookings`       | List bookings        |
| DELETE | `/api/bookings/:id`   | Cancel a booking     |

## Database Schema

- **cities** — Available cities
- **buses** — Bus fleet (name, number, type, seats)
- **routes** — Bus routes with fare, timing, and date
- **bookings** — Passenger bookings with seat numbers
