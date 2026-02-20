const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'birdy_jwt_secret_dev';

function validateUsername(username) {
  return /^[a-zA-Z0-9_]{3,30}$/.test(username);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  if (!password || password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[^A-Za-z0-9]/.test(password)) return false;
  return true;
}

async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !validateUsername(username)) {
      return res.status(400).json({ error: 'Username must be 3-30 characters, alphanumeric or underscore' });
    }
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
      });
    }

    if (userModel.findByEmail(email)) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    if (userModel.findByUsername(username)) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = userModel.create({ username, email, password_hash });
    const user = userModel.findById(result.lastInsertRowid);

    const token = jwt.sign(
      { id: user.id, username: user.username, is_admin: user.is_admin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({ token, user: { id: user.id, username: user.username, is_admin: user.is_admin } });
  } catch (err) {
    return res.status(500).json({ error: 'Registration failed' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, is_admin: user.is_admin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({ token, user: { id: user.id, username: user.username, is_admin: user.is_admin } });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed' });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = userModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'No account with that email' });
    }

    const plainToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(plainToken).digest('hex');
    const expires = Math.floor(Date.now() / 1000) + 3600; // 1 hour

    userModel.setResetToken(email, hashedToken, expires);

    return res.json({ token: plainToken, message: 'Password reset token generated' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process request' });
  }
}

module.exports = { register, login, forgotPassword };
