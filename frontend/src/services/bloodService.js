import api from './api';

const bloodService = {
  search: async (filters) => {
    const response = await api.get('/api/blood/search', { params: filters });
    return response.data;
  }
};

export default bloodService;
