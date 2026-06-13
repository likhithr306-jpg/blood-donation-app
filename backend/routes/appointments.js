const express = require('express');
const authMiddleware = require('../middleware/auth');
const appointmentService = require('../services/appointmentService');

const router = express.Router();

router.post('/book', authMiddleware, async (req, res) => {
  try {
    const { hospitalName, date, time } = req.body;
    if (!hospitalName || !date || !time) {
      return res.status(400).json({ message: 'Hospital, date, and time are required.' });
    }
    const appointment = await appointmentService.bookAppointment({
      userId: req.user.id,
      userType: req.user.type,
      hospitalName,
      date,
      time
    });
    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ message: 'Unable to book appointment.', error: error.message });
  }
});

router.get('/user', authMiddleware, async (req, res) => {
  try {
    const appointments = await appointmentService.getAppointmentsByUser(req.user.id, req.user.type);
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: 'Unable to retrieve appointments.', error: error.message });
  }
});

module.exports = router;
