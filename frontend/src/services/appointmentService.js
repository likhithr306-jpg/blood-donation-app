import api from './api';

const appointmentService = {
  book: async (payload, token) => {
    const response = await api.post('/api/appointments/book', payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  getUserAppointments: async (token) => {
    const response = await api.get('/api/appointments/user', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

export default appointmentService;
