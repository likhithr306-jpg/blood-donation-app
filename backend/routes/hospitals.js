const express = require('express');
const axios = require('axios');
const bloodService = require('../services/bloodService');

const router = express.Router();

function distanceBetween(lat1, lon1, lat2, lon2) {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(6371 * c * 100) / 100;
}

function fallbackHospitals(lat, lon) {
  return [
    {
      name: 'City Care Hospital',
      address: '12 Red Cross Road',
      latitude: lat + 0.005,
      longitude: lon + 0.004,
      distance: 0.7,
      availableSlots: 6
    },
    {
      name: 'Saint Mercy Medical Center',
      address: '45 Hope Avenue',
      latitude: lat - 0.003,
      longitude: lon - 0.006,
      distance: 0.8,
      availableSlots: 4
    },
    {
      name: 'Hope Blood Bank',
      address: '90 Life Street',
      latitude: lat + 0.007,
      longitude: lon - 0.002,
      distance: 1.1,
      availableSlots: 5
    }
  ];
}

async function fetchHospitalsFromOpenStreetMap(lat, lon, radius = 5000) {
  const query = `[out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lon});
      way["amenity"="hospital"](around:${radius},${lat},${lon});
      relation["amenity"="hospital"](around:${radius},${lat},${lon});
    );
    out center;`;

  const url = 'https://overpass-api.de/api/interpreter';
  const response = await axios.post(url, query, {
    headers: { 'Content-Type': 'text/plain' },
    timeout: 20000
  });

  if (!response.data || !response.data.elements) {
    throw new Error('Invalid OpenStreetMap response');
  }

  return response.data.elements.map((element) => {
    const latValue = element.lat || (element.center && element.center.lat);
    const lonValue = element.lon || (element.center && element.center.lon);
    const name = element.tags?.name || 'Nearby Hospital';
    const addressParts = [];
    ['addr:street', 'addr:housenumber', 'addr:city', 'addr:postcode'].forEach((key) => {
      if (element.tags?.[key]) addressParts.push(element.tags[key]);
    });
    const address = addressParts.length ? addressParts.join(', ') : 'OpenStreetMap nearby hospital';
    return {
      name,
      address,
      latitude: latValue,
      longitude: lonValue,
      distance: distanceBetween(lat, lon, latValue, lonValue),
      availableSlots: Math.floor(Math.random() * 8) + 3
    };
  });
}

router.get('/nearby', async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);
  const radius = parseInt(req.query.radius, 10) || 5000;

  if (!lat || !lon) {
    const fallback = fallbackHospitals(0, 0);
    return res.json({ hospitals: fallback, inventory: {} });
  }

  try {
    const hospitals = await fetchHospitalsFromOpenStreetMap(lat, lon, radius);
    const inventory = await bloodService.getInventory();
    res.json({ hospitals, inventory });
  } catch (error) {
    const fallback = fallbackHospitals(lat, lon);
    const inventory = await bloodService.getInventory();
    res.json({ hospitals: fallback, inventory });
  }
});

module.exports = router;
