import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { searchRoutes } from '../api';

export default function SearchResults() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const source = params.get('source');
  const destination = params.get('destination');
  const date = params.get('date');

  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!source || !destination) {
      navigate('/');
      return;
    }

    setLoading(true);
    searchRoutes(source, destination, date)
      .then(setRoutes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [source, destination, date, navigate]);

  return (
    <section className="section">
      <div className="container">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>← Back to search</Link>
          <h2 className="section-title" style={{ marginTop: '0.5rem' }}>
            {source} → {destination}
            {date && <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '1rem' }}> · {date}</span>}
          </h2>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Searching buses...</p>}

        {!loading && routes.length === 0 && !error && (
          <div className="empty-state">
            <div className="icon">🚌</div>
            <h3>No buses found</h3>
            <p>Try a different route or date.</p>
          </div>
        )}

        {routes.map((route) => (
          <div key={route.id} className="bus-card">
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
                <div>
                  <strong>{route.bus_number}</strong>
                </div>
              </div>
            </div>
            <div className="bus-price">
              <div className="fare">₹{route.fare}</div>
              <div className="seats">
                {route.available_seats > 0
                  ? `${route.available_seats} seats left`
                  : 'Sold out'}
              </div>
              <button
                className="btn btn-primary"
                style={{ marginTop: '0.75rem' }}
                disabled={route.available_seats === 0}
                onClick={() => navigate(`/book/${route.id}`)}
              >
                Select Seats
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
