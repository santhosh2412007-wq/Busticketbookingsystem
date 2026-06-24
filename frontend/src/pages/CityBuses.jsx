import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCities, getRoutesByCity } from '../api';

export default function CityBuses() {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCities().then(setCities).catch(() => setError('Failed to load cities.'));
    setDate(new Date().toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (!city) {
      setRoutes([]);
      return;
    }

    setLoading(true);
    setError('');
    getRoutesByCity(city, date)
      .then(setRoutes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [city, date]);

  const departures = routes.filter((r) => r.direction === 'departure');
  const arrivals = routes.filter((r) => r.direction === 'arrival');

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">All Bus Travels in City</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          View all buses departing from or arriving to a city.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ minWidth: '200px' }}>
            <label>Select City</label>
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Choose a city</option>
              {cities.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ minWidth: '200px' }}>
            <label>Date</label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {!city && (
          <div className="empty-state">
            <div className="icon">🏙️</div>
            <h3>Select a city</h3>
            <p>Choose a city above to see all bus travels.</p>
          </div>
        )}

        {city && loading && <p style={{ color: 'var(--text-muted)' }}>Loading buses...</p>}

        {city && !loading && routes.length === 0 && !error && (
          <div className="empty-state">
            <div className="icon">🚌</div>
            <h3>No buses found</h3>
            <p>No bus travels for {city} on {date}.</p>
          </div>
        )}

        {departures.length > 0 && (
          <>
            <h3 style={{ marginBottom: '1rem' }}>Departures from {city} ({departures.length})</h3>
            {departures.map((route) => (
              <RouteCard key={route.id} route={route} onBook={() => navigate(`/book/${route.id}`)} />
            ))}
          </>
        )}

        {arrivals.length > 0 && (
          <>
            <h3 style={{ margin: '2rem 0 1rem' }}>Arrivals to {city} ({arrivals.length})</h3>
            {arrivals.map((route) => (
              <RouteCard key={route.id} route={route} onBook={() => navigate(`/book/${route.id}`)} />
            ))}
          </>
        )}
      </div>
    </section>
  );
}

function RouteCard({ route, onBook }) {
  return (
    <div className="bus-card">
      <div className="bus-info">
        <h3>{route.bus_name}</h3>
        <span className="bus-type">{route.bus_type}</span>
        <div className="bus-meta">
          <div className="time-block">
            <div className="time">{route.departure_time}</div>
            <div className="label">{route.source_city}</div>
          </div>
          <div style={{ color: 'var(--text-muted)' }}>→</div>
          <div className="time-block">
            <div className="time">{route.arrival_time}</div>
            <div className="label">{route.destination_city}</div>
          </div>
          <div><strong>{route.bus_number}</strong></div>
          <div><strong>{route.travel_date}</strong></div>
        </div>
      </div>
      <div className="bus-price">
        <div className="fare">₹{route.fare}</div>
        <div className="seats">
          {route.available_seats > 0 ? `${route.available_seats} seats left` : 'Sold out'}
        </div>
        <button
          className="btn btn-primary"
          style={{ marginTop: '0.75rem' }}
          disabled={route.available_seats === 0}
          onClick={onBook}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
