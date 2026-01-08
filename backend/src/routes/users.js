const express = require('express');
const router = express.Router();
const {
  getUsersByTenant,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

// Get all users (Admin only)
router.get('/', authorize('admin'), getAllUsers);

// Get users by tenant (Admin and Managers)
router.get('/tenant/:tenant_id',authenticate, authorize('admin', 'hm','ha'), getUsersByTenant);

// Get user by ID
router.get('/:id', getUserById);

// Update user
router.patch('/:id', updateUser);

// Delete user (Admin only)
router.delete('/:id',authenticate, authorize('admin'), deleteUser);

module.exports = router;