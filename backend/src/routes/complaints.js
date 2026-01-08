const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  getComplaintsByTenantId,
  getComplaintsByConsumerId,
  assignComplaint,
  updateComplaintStatus,
  addComplaintUpdate,
  confirmResolution
} = require('../controllers/complaintController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

router.post('/', authorize('consumer'), createComplaint);

// Get all complaints (with role-based filtering)
router.get('/', getAllComplaints);

router.get('/:id', getComplaintById);
router.get('/tenant/:tenantId', authorize('hm', 'ha'),  getComplaintsByTenantId);
router.get('/consumer/:consumerId', authorize('consumer'), getComplaintsByConsumerId);

// Assign complaint (Helpdesk Agents)
router.patch('/:id/assign', authorize('ha', 'hm'), assignComplaint);

// Update complaint status (Agents and Support)
router.patch('/:id/status', authorize('ha', 'sp', 'hm'), updateComplaintStatus);

// Add update/note to complaint (All staff)
router.post('/:id/updates', authorize('ha', 'sp', 'hm'), addComplaintUpdate);

// Confirm resolution (Consumers only)
router.post('/:id/confirm', authorize('consumer'), confirmResolution);

module.exports = router;