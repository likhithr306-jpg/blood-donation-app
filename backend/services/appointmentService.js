const path = require('path');
const { v4: uuidv4 } = require('uuid');
const csvStorage = require('./csvStorage');

const dataFolder = path.join(__dirname, '..', 'csv-data');
const appointmentsFile = path.join(dataFolder, 'appointments.csv');

async function getAppointments() {
  return csvStorage.readCsv(appointmentsFile);
}

async function getAppointmentsByUser(userId, userType) {
  const appointments = await getAppointments();
  return appointments.filter((appointment) => appointment.userId === userId && appointment.userType === userType);
}

async function bookAppointment(payload) {
  const appointment = {
    appointmentId: uuidv4(),
    userId: payload.userId,
    userType: payload.userType,
    hospitalName: payload.hospitalName,
    date: payload.date,
    time: payload.time,
    status: 'Pending'
  };
  await csvStorage.appendCsv(appointmentsFile, appointment, [
    'appointmentId',
    'userId',
    'userType',
    'hospitalName',
    'date',
    'time',
    'status'
  ]);
  return appointment;
}

module.exports = {
  getAppointments,
  getAppointmentsByUser,
  bookAppointment
};
