import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRoute, createBooking } from '../api';

export default function Booking() {
  const { routeId } = useParams();
  const navigate = useNavigate();

  const [route, setRoute] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getRoute(routeId)
      .then(setRoute)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [routeId]);

  const toggleSeat = (seatNum) => {
    if (route.booked_seats.includes(seatNum)) return;

    setSelectedSeats((prev) =>
      prev.includes(seatNum)
        ? prev.filter((s) => s !== seatNum)
        : [...prev, seatNum]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (selectedSeats.length === 0) {
      setError('Please select at least one seat.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await createBooking({
        route_id: Number(routeId),
        passenger_name: form.name,
        passenger_email: form.email,
        passenger_phone: form.phone,
        seat_numbers: selectedSeats,
      });
      setSuccess(`Booking confirmed! Booking ID: #${result.id}. Total: ₹${result.total_fare}`);
      setTimeout(() => navigate('/my-bookings'), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="section">
        <div className="container"><p>Loading...</p></div>
      </section>
    );
  }

  if (!route) {
    return (
      <section className="section">
        <div className="container">
          <div className="alert alert-error">{error || 'Route not found.'}</div>
          <Link to="/">← Back to home</Link>
        </div>
      </section>
    );
  }

  const seats = Array.from({ length: route.total_seats }, (_, i) => i + 1);
  const totalFare = route.fare * selectedSeats.length;

  return (
    <section className="section">
      <div className="container">
        <Link to={`/search?source=${route.source_city}&destination=${route.destination_city}&date=${route.travel_date}`}
          style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          ← Back to results
        </Link>

        <h2 className="section-title" style={{ marginTop: '0.5rem' }}>
          {route.bus_name} — {route.source_city} to {route.destination_city}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          {route.travel_date} · Departs {route.departure_time} · {route.bus_type}
        </p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="seat-layout">
          <h3>Select Seats</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Click to select/deselect seats</p>

          <div className="seat-grid">
            {seats.map((num) => {
              const isBooked = route.booked_seats.includes(num);
              const isSelected = selectedSeats.includes(num);
              let cls = 'seat available';
              if (isBooked) cls = 'seat booked';
              else if (isSelected) cls = 'seat selected';

              return (
                <div key={num} className={cls} onClick={() => toggleSeat(num)}>
                  {num}
                </div>
              );
            })}
          </div>

          <div className="seat-legend">
            <div className="legend-item"><div className="legend-dot available" /> Available</div>
            <div className="legend-item"><div className="legend-dot selected" /> Selected</div>
            <div className="legend-item"><div className="legend-dot booked" /> Booked</div>
          </div>
        </div>

        {selectedSeats.length > 0 && (
          <form className="booking-form" onSubmit={handleSubmit}>
            <h3>Passenger Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>

            <div className="booking-summary">
              <div>
                <strong>Seats:</strong> {selectedSeats.sort((a, b) => a - b).join(', ')}
              </div>
              <div className="total">Total: ₹{totalFare}</div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
