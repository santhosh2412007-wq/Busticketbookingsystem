import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCities } from '../api';

export default function Home() {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getCities()
      .then(setCities)
      .catch(() => setError('Failed to load cities. Is the backend running?'));
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');

    if (!source || !destination) {
      setError('Please select source and destination.');
      return;
    }
    if (source === destination) {
      setError('Source and destination cannot be the same.');
      return;
    }

    const params = new URLSearchParams({ source, destination, date });
    navigate(`/search?${params}`);
  };

  const swapCities = () => {
    setSource(destination);
    setDestination(source);
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Book Bus Tickets Online</h1>
          <p>Search, compare, and book bus tickets across India</p>
        </div>
      </section>

      <div className="container">
        <div className="search-card">
          {error && <div className="alert alert-error">{error}</div>}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="form-group">
              <label>From</label>
              <select value={source} onChange={(e) => setSource(e.target.value)}>
                <option value="">Select city</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>To</label>
              <select value={destination} onChange={(e) => setDestination(e.target.value)}>
                <option value="">Select city</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="btn btn-outline" onClick={swapCities} title="Swap cities">
                ⇄
              </button>
              <button type="submit" className="btn btn-primary">
                Search Buses
              </button>
            </div>
          </form>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Why choose BusGo?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: '🔍', title: 'Easy Search', desc: 'Find buses by route, date, and bus type instantly.' },
              { icon: '💺', title: 'Seat Selection', desc: 'Choose your preferred seats with live availability.' },
              { icon: '📱', title: 'Instant Booking', desc: 'Book tickets in seconds with instant confirmation.' },
            ].map((f) => (
              <div key={f.title} className="bus-card" style={{ gridTemplateColumns: '1fr' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
