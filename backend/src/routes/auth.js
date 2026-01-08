const express = require('express');
const router = express.Router();
const { 
  registerConsumer, 
  createStaffUser, 
  login, 
  getProfile 
} = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiters');

// Public routes
router.post('/register', registerConsumer);  // Only creates consumers
router.post('/login',loginLimiter, login);

// Protected routes - Admin only
router.post('/admin/create-staff', authenticate, authorize('admin'), createStaffUser);

// Protected routes - All authenticated users
router.get('/profile', authenticate, getProfile);

module.exports = router;