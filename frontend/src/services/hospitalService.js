import api from './api';

const hospitalService = {
  fetchNearby: async (coords) => {
    const response = await api.get('/api/hospitals/nearby', {
      params: {
        lat: coords.latitude,
        lon: coords.longitude,
        radius: coords.radius || 5000
      }
    });
    return response.data;
  }
};

export default hospitalService;
