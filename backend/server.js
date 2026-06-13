const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/auth');
const bloodRoutes = require('./routes/blood');
const appointmentRoutes = require('./routes/appointments');
const hospitalRoutes = require('./routes/hospitals');
const bloodService = require('./services/bloodService');

const app = express();
const PORT = process.env.PORT || 5000;
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'blood-donation-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/blood', bloodRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/hospitals', hospitalRoutes);

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.send('Blood donation API is running. Build the frontend to serve the UI.');
  });
}

async function start() {
  try {
    await bloodService.seedDefaultInventory();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
