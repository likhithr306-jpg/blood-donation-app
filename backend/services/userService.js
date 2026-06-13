const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const csvStorage = require('./csvStorage');

const dataFolder = path.join(__dirname, '..', 'csv-data');
const donorsFile = path.join(dataFolder, 'donors.csv');
const acceptorsFile = path.join(dataFolder, 'acceptors.csv');

async function getDonors() {
  return csvStorage.readCsv(donorsFile);
}

async function getAcceptors() {
  return csvStorage.readCsv(acceptorsFile);
}

async function findDonorByEmail(email) {
  const donors = await getDonors();
  return donors.find((donor) => donor.email.toLowerCase() === email.toLowerCase());
}

async function findAcceptorByEmail(email) {
  const acceptors = await getAcceptors();
  return acceptors.find((acceptor) => acceptor.email.toLowerCase() === email.toLowerCase());
}

async function findUserByEmail(email) {
  const donor = await findDonorByEmail(email);
  if (donor) return { user: donor, type: 'donor' };
  const acceptor = await findAcceptorByEmail(email);
  if (acceptor) return { user: acceptor, type: 'acceptor' };
  return null;
}

async function createDonor(data) {
  const id = uuidv4();
  const passwordHash = await bcrypt.hash(data.password, 10);
  const donor = {
    id,
    name: data.name,
    age: data.age,
    gender: data.gender,
    mobile: data.mobile,
    email: data.email,
    address: data.address,
    bloodGroup: data.bloodGroup,
    lastDonationDate: data.lastDonationDate,
    healthStatus: data.healthStatus,
    passwordHash
  };
  await csvStorage.appendCsv(donorsFile, donor, [
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
  return donor;
}

async function createAcceptor(data) {
  const id = uuidv4();
  const passwordHash = await bcrypt.hash(data.password, 10);
  const acceptor = {
    id,
    name: data.name,
    mobile: data.mobile,
    email: data.email,
    address: data.address,
    requiredBloodGroup: data.requiredBloodGroup,
    hospitalPreference: data.hospitalPreference,
    passwordHash
  };
  await csvStorage.appendCsv(acceptorsFile, acceptor, [
    'id',
    'name',
    'mobile',
    'email',
    'address',
    'requiredBloodGroup',
    'hospitalPreference',
    'passwordHash'
  ]);
  return acceptor;
}

async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.passwordHash);
}

module.exports = {
  getDonors,
  getAcceptors,
  findDonorByEmail,
  findAcceptorByEmail,
  findUserByEmail,
  createDonor,
  createAcceptor,
  verifyPassword
};
