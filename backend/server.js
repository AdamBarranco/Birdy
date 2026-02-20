require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { authLimiter } = require('./middleware/rateLimiter');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth', authLimiter);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/chirps', require('./routes/chirps'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(5000, () => {
    console.log('Birdy backend running on port 5000');
  });
}

module.exports = app;
