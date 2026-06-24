import { useState } from 'react';
import { getBookings, cancelBooking } from '../api';

export default function MyBookings() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    setMessage('');
    try {
      const data = await getBookings(email);
      setBookings(data);
      setSearched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, booking_status: 'cancelled' } : b))
      );
      setMessage('Booking cancelled successfully.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">My Bookings</h2>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', maxWidth: '500px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email used for booking"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'end' }} disabled={loading}>
            {loading ? 'Loading...' : 'View Bookings'}
          </button>
        </form>

        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        {searched && bookings.length === 0 && (
          <div className="empty-state">
            <div className="icon">📋</div>
            <h3>No bookings found</h3>
            <p>No bookings found for this email address.</p>
          </div>
        )}

        {bookings.map((b) => (
          <div key={b.id} className="booking-card">
            <div className="booking-header">
              <span className="booking-id">Booking #{b.id}</span>
              <span className={`status ${b.booking_status}`}>{b.booking_status}</span>
            </div>
            <div className="booking-details">
              <div><strong>Passenger</strong>{b.passenger_name}</div>
              <div><strong>Route</strong>{b.source_city} → {b.destination_city}</div>
              <div><strong>Bus</strong>{b.bus_name} ({b.bus_number})</div>
              <div><strong>Date</strong>{b.travel_date}</div>
              <div><strong>Time</strong>{b.departure_time} - {b.arrival_time}</div>
              <div><strong>Seats</strong>{b.seat_numbers}</div>
              <div><strong>Total Fare</strong>₹{b.total_fare}</div>
            </div>
            {b.booking_status === 'confirmed' && (
              <button
                className="btn btn-danger"
                style={{ marginTop: '1rem' }}
                onClick={() => handleCancel(b.id)}
              >
                Cancel Booking
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
