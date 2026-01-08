const express = require('express');
const router = express.Router();
const {
  createTenant,
  getAllTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
  getActiveTenants
} = require('../controllers/tenantController');
const { authenticate, authorize } = require('../middleware/auth');

// Public route - Get active tenants for consumer registration
router.get('/active', getActiveTenants);

// Admin only routes
router.post('/', authenticate, authorize('admin'), createTenant);
router.get('/', authenticate, authorize('admin'), getAllTenants);
router.get('/:id', authenticate, authorize('admin'), getTenantById);
router.patch('/:id', authenticate, authorize('admin'), updateTenant);
router.delete('/:id', authenticate, authorize('admin'), deleteTenant);

module.exports = router;