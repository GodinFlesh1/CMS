const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');
const tenantsRoutes = require('./routes/tenants');
const userRoutes = require('./routes/users')
const complaintRoutes = require('./routes/complaints')
const { apiLimiter } = require('./middleware/rateLimiters');
const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

module.exports = app;