import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import CityBuses from './pages/CityBuses';

function App() {
  return (
    <>
      <nav className="navbar">
        <div className="container">
          <NavLink to="/" className="logo">
            <span className="logo-icon">🚌</span> BusGo
          </NavLink>
          <ul className="nav-links">
            <li><NavLink to="/" end>Home</NavLink></li>
            <li><NavLink to="/city-buses">City Buses</NavLink></li>
            <li><NavLink to="/my-bookings">My Bookings</NavLink></li>
          </ul>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/book/:routeId" element={<Booking />} />
        <Route path="/city-buses" element={<CityBuses />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 BusGo. Book your bus tickets online.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
