const API_BASE = '/api';

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

export const getCities = () => request('/cities');

export const getRoutesByCity = (city, date) => {
  const params = new URLSearchParams({ city });
  if (date) params.append('date', date);
  return request(`/routes/city?${params}`);
};

export const searchRoutes = (source, destination, date) => {
  const params = new URLSearchParams({ source, destination });
  if (date) params.append('date', date);
  return request(`/routes/search?${params}`);
};

export const getRoute = (id) => request(`/routes/${id}`);

export const createBooking = (data) =>
  request('/bookings', { method: 'POST', body: JSON.stringify(data) });

export const getBookings = (email) => {
  const params = email ? `?email=${encodeURIComponent(email)}` : '';
  return request(`/bookings${params}`);
};

export const cancelBooking = (id) =>
  request(`/bookings/${id}`, { method: 'DELETE' });
