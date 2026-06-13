const express = require('express');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'blood-secret-key';

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register-donor', async (req, res) => {
  try {
    const { email, password, name, age, gender, mobile, address, bloodGroup, lastDonationDate, healthStatus } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingDonor = await userService.findDonorByEmail(email);
    if (existingDonor) {
      return res.status(409).json({ message: 'A donor with this email already exists.' });
    }

    const donor = await userService.createDonor({ email, password, name, age, gender, mobile, address, bloodGroup, lastDonationDate, healthStatus });
    const token = createToken({ id: donor.id, email: donor.email, type: 'donor' });

    res.json({ token, user: { ...donor, passwordHash: undefined, type: 'donor' } });
  } catch (error) {
    res.status(500).json({ message: 'Unable to create donor account.', error: error.message });
  }
});

router.post('/register-acceptor', async (req, res) => {
  try {
    const { email, password, name, mobile, address, requiredBloodGroup, hospitalPreference } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingAcceptor = await userService.findAcceptorByEmail(email);
    if (existingAcceptor) {
      return res.status(409).json({ message: 'An acceptor with this email already exists.' });
    }

    const acceptor = await userService.createAcceptor({ email, password, name, mobile, address, requiredBloodGroup, hospitalPreference });
    const token = createToken({ id: acceptor.id, email: acceptor.email, type: 'acceptor' });

    res.json({ token, user: { ...acceptor, passwordHash: undefined, type: 'acceptor' } });
  } catch (error) {
    res.status(500).json({ message: 'Unable to create acceptor account.', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const combinedUser = await userService.findUserByEmail(email);
    if (!combinedUser) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const valid = await userService.verifyPassword(combinedUser.user, password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = createToken({ id: combinedUser.user.id, email: combinedUser.user.email, type: combinedUser.type });
    const user = { ...combinedUser.user, passwordHash: undefined, type: combinedUser.type };

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Unable to authenticate.', error: error.message });
  }
});

module.exports = router;
