const path = require('path');
const csvStorage = require('./csvStorage');

const dataFolder = path.join(__dirname, '..', 'csv-data');
const inventoryFile = path.join(dataFolder, 'blood_inventory.csv');

async function getInventory() {
  return csvStorage.readCsv(inventoryFile);
}

async function searchInventory(filters = {}) {
  const inventory = await getInventory();
  return inventory.filter((item) => {
    const matchBloodGroup = filters.bloodGroup ? item.bloodGroup.toLowerCase() === filters.bloodGroup.toLowerCase() : true;
    const matchHospital = filters.hospital ? item.hospitalName.toLowerCase().includes(filters.hospital.toLowerCase()) : true;
    return matchBloodGroup && matchHospital;
  });
}

async function seedDefaultInventory() {
  const existing = await getInventory();
  if (existing.length > 0) {
    return existing;
  }

  const now = new Date().toISOString();
  const sample = [
    { hospitalName: 'City Care Hospital', bloodGroup: 'A+', availableUnits: '10', lastUpdated: now },
    { hospitalName: 'City Care Hospital', bloodGroup: 'B+', availableUnits: '5', lastUpdated: now },
    { hospitalName: 'City Care Hospital', bloodGroup: 'O-', availableUnits: '3', lastUpdated: now },
    { hospitalName: 'Saint Mercy Medical Center', bloodGroup: 'AB+', availableUnits: '7', lastUpdated: now },
    { hospitalName: 'Saint Mercy Medical Center', bloodGroup: 'O+', availableUnits: '4', lastUpdated: now },
    { hospitalName: 'Hope Blood Bank', bloodGroup: 'A-', availableUnits: '2', lastUpdated: now },
    { hospitalName: 'Hope Blood Bank', bloodGroup: 'B-', availableUnits: '3', lastUpdated: now }
  ];
  await csvStorage.writeCsv(inventoryFile, sample, ['hospitalName', 'bloodGroup', 'availableUnits', 'lastUpdated']);
  return sample;
}

module.exports = {
  getInventory,
  searchInventory,
  seedDefaultInventory
};
