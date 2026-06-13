import api from './api';

const authService = {
  registerDonor: async (payload) => {
    const response = await api.post('/api/auth/register-donor', payload);
    return response.data;
  },
  registerAcceptor: async (payload) => {
    const response = await api.post('/api/auth/register-acceptor', payload);
    return response.data;
  },
  login: async (payload) => {
    const response = await api.post('/api/auth/login', payload);
    return response.data;
  }
};

export default authService;
