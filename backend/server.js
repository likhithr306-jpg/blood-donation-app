const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const csvStorage = require('./services/csvStorage');
const authRoutes = require('./routes/auth');
const hospitalRoutes = require('./routes/hospitals');
const bloodRoutes = require('./routes/blood');
const appointmentRoutes = require('./routes/appointments');
const bloodService = require('./services/bloodService');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const dataFolder = path.join(__dirname, 'csv-data');

app.use(cors());
app.use(express.json());

const staticFolder = path.join(__dirname, '..');
app.use(express.static(staticFolder));

async function initializeCsvStorage() {
  await csvStorage.ensureCsvFile(path.join(dataFolder, 'donors.csv'), [
    'id',
    'name',
    'age',
    'gender',
    'mobile',
    'email',
    'address',
    'bloodGroup',
    'lastDonationDate',
    'healthStatus',
    'passwordHash'
  ]);

  await csvStorage.ensureCsvFile(path.join(dataFolder, 'acceptors.csv'), [
    'id',
    'name',
    'mobile',
    'email',
    'address',
    'requiredBloodGroup',
    'hospitalPreference',
    'passwordHash'
  ]);

  await csvStorage.ensureCsvFile(path.join(dataFolder, 'appointments.csv'), [
    'appointmentId',
    'userId',
    'userType',
    'hospitalName',
    'date',
    'time',
    'status'
  ]);

  await csvStorage.ensureCsvFile(path.join(dataFolder, 'blood_inventory.csv'), [
    'hospitalName',
    'bloodGroup',
    'availableUnits',
    'lastUpdated'
  ]);

  await bloodService.seedDefaultInventory();
}

app.use('/api/auth', authRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/blood', bloodRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(staticFolder, 'index.html'));
});

initializeCsvStorage()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize CSV storage:', error);
    process.exit(1);
  });
