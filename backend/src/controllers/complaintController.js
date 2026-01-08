const { Complaint, ComplaintUpdate, User, Tenant } = require('../models/index');


const createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and description'
      });
    }

    
    const complaint = await Complaint.create({
      tenant_id: req.user.tenant_id,
      consumer_id: req.user.id,
      title,
      description,
      category: category || null,
      priority: priority || 'medium',
      status: 'logged'
    });

    // Create initial update log
    await ComplaintUpdate.create({
      complaint_id: complaint.id,
      user_id: req.user.id,
      note: 'Complaint logged by consumer',
      status_changed_to: 'logged',
      is_resolution: false
    });

    res.status(201).json({
      success: true,
      message: 'Complaint created successfully',
      data: { complaint }
    });

  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all complaints (with tenant filtering)
const getAllComplaints = async (req, res) => {
  try {
    const { status, priority } = req.query;

    const whereClause = {};

    // Tenant isolation - non-admin users see only their tenant's complaints
    if (req.user.role !== 'admin') {
      whereClause.tenant_id = req.user.tenant_id;
    }

    // Consumers see only their own complaints
    if (req.user.role === 'consumer') {
      whereClause.consumer_id = req.user.id;
    }

    // Support persons see only assigned complaints
    if (req.user.role === 'sp') {
      whereClause.assigned_to = req.user.id;
    }

    // Apply filters
    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;

    const complaints = await Complaint.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'consumer',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: Tenant,
          attributes: ['id', 'name', 'type']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: { 
        complaints,
        count: complaints.length 
      }
    });

  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findByPk(id, {
      include: [
        {
          model: User,
          as: 'consumer',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: Tenant,
          attributes: ['id', 'name', 'type']
        },
        {
          model: ComplaintUpdate,
          include: [{
            model: User,
            attributes: ['id', 'first_name', 'last_name', 'role']
          }],
          order: [['created_at', 'ASC']]
        }
      ]
    });


    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Tenant isolation check
    if (req.user.role !== 'admin' && req.user.tenant_id !== complaint.tenant_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Consumer can only see their own complaints
    if (req.user.role === 'consumer' && req.user.id !== complaint.consumer_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own complaints'
      });
    }

    res.status(200).json({
      success: true,
      data: { complaint }
    });

  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const getComplaintsByConsumerId = async (req, res) => {
  try {
    const { consumerId } = req.params;

    // Debug logs (optional)
    // console.log("Logged In User:", req.user);
    // console.log("Requested Consumer ID:", consumerId);

    // // Only consumer themselves OR hm/ha from same tenant can view
    // const allowedRoles = ['consumer', 'ha', 'hm'];

    // if (!allowedRoles.includes(req.user.role)) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Access denied. You are not allowed to view consumer complaints'
    //   });
    // }

    // Consumer: can ONLY view their own complaints
    if (req.user.role === 'consumer' && req.user.id !== Number(consumerId)) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own complaints'
      });
    }

    // hm/ha: must belong to same tenant
    // if (['ha', 'hm'].includes(req.user.role)) {
    //   const targetConsumer = await User.findByPk(consumerId);

    //   if (!targetConsumer) {
    //     return res.status(404).json({
    //       success: false,
    //       message: 'Target consumer not found'
    //     });
    //   }

    //   if (targetConsumer.tenant_id !== req.user.tenant_id) {
    //     return res.status(403).json({
    //       success: false,
    //       message: 'You cannot view complaints of consumers from another tenant'
    //     });
    //   }
    // }

    const complaints = await Complaint.findAll({
      where: { consumer_id: consumerId },
      include: [
        {
          model: User,
          as: 'consumer',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: Tenant,
          attributes: ['id', 'name', 'type']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: {
        complaints,
        count: complaints.length
      }
    });

  } catch (error) {
    console.error('Get complaints by consumer error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


// Get complaints for a specific tenant (hm & ha only)
const getComplaintsByTenantId = async (req, res) => {
  try {
    const { tenantId } = req.params;

    // only hm and ha can access this endpoint
    if (!['hm', 'ha'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only Helpdesk Manager and Helpdesk Agent can view tenant complaints'
      });
    }

    // They should only be able to see THEIR OWN tenant's complaints
    if (Number(tenantId) !== req.user.tenant_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view complaints for your own tenant'
      });
    }

    const whereClause = {
      tenant_id: tenantId
    };

   
    const complaints = await Complaint.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'consumer',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: Tenant,
          attributes: ['id', 'name', 'type']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    

    return res.status(200).json({
      success: true,
      data: {
        complaints,
        count: complaints.length
      }
    });

  } catch (error) {
    console.error('Get complaints by tenant error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


// Assign complaint to support person (Helpdesk Agent)
const assignComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { assigned_to } = req.body;

    if (!assigned_to) {
      return res.status(400).json({
        success: false,
        message: 'Please provide assigned_to user ID'
      });
    }

    const complaint = await Complaint.findByPk(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Tenant isolation
    if (req.user.tenant_id !== complaint.tenant_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Verify assigned user exists and is support_person
    const assignedUser = await User.findByPk(assigned_to);
    if (!assignedUser || assignedUser.role !== 'sp') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user. Must assign to a support person'
      });
    }

    // Verify support person is from same tenant
    if (assignedUser.tenant_id !== complaint.tenant_id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot assign to support person from different organization'
      });
    }

    // Update complaint
    await complaint.update({
      assigned_to,
      status: 'assigned'
    });

    // Log the assignment
    await ComplaintUpdate.create({
      complaint_id: complaint.id,
      user_id: req.user.id,
      note: `Complaint assigned to ${assignedUser.first_name} ${assignedUser.last_name}`,
      status_changed_to: 'assigned',
      is_resolution: false
    });

    res.status(200).json({
      success: true,
      message: 'Complaint assigned successfully',
      data: { complaint }
    });

  } catch (error) {
    console.error('Assign complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update complaint status
const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    const validStatuses = ['logged', 'assigned', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const complaint = await Complaint.findByPk(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Tenant isolation
    if (req.user.role !== 'admin' && req.user.tenant_id !== complaint.tenant_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update complaint
    const updateData = { status };
    if (status === 'resolved') {
      updateData.resolved_at = new Date();
    }
    if (status === 'closed') {
      updateData.closed_at = new Date();
    }

    await complaint.update(updateData);

    // Log the update
    await ComplaintUpdate.create({
      complaint_id: complaint.id,
      user_id: req.user.id,
      note: note || `Status changed to ${status}`,
      status_changed_to: status,
      is_resolution: status === 'resolved'
    });

    res.status(200).json({
      success: true,
      message: 'Complaint status updated successfully',
      data: { complaint }
    });

  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Add update/note to complaint
const addComplaintUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a note'
      });
    }

    const complaint = await Complaint.findByPk(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Tenant isolation
    if (req.user.role !== 'admin' && req.user.tenant_id !== complaint.tenant_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Create update
    const update = await ComplaintUpdate.create({
      complaint_id: complaint.id,
      user_id: req.user.id,
      note,
      is_resolution: false
    });

    res.status(201).json({
      success: true,
      message: 'Update added successfully',
      data: { update }
    });

  } catch (error) {
    console.error('Add complaint update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Confirm resolution (Consumer only)
const confirmResolution = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    const complaint = await Complaint.findByPk(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Only the consumer who created the complaint can confirm
    if (req.user.id !== complaint.consumer_id) {
      return res.status(403).json({
        success: false,
        message: 'Only the complaint owner can confirm resolution'
      });
    }

    if (complaint.status !== 'resolved') {
      return res.status(400).json({
        success: false,
        message: 'Complaint must be in resolved status to confirm'
      });
    }

    // Find the resolution update
    const resolutionUpdate = await ComplaintUpdate.findOne({
      where: {
        complaint_id: complaint.id,
        is_resolution: true
      }
    });

    if (resolutionUpdate) {
      await resolutionUpdate.update({
        consumer_confirmed: true,
        consumer_feedback: feedback || null
      });
    }

    // Close the complaint
    await complaint.update({
      status: 'closed',
      closed_at: new Date()
    });

    // Log the confirmation
    await ComplaintUpdate.create({
      complaint_id: complaint.id,
      user_id: req.user.id,
      note: 'Resolution confirmed by consumer',
      status_changed_to: 'closed',
      is_resolution: false
    });

    res.status(200).json({
      success: true,
      message: 'Resolution confirmed and complaint closed',
      data: { complaint }
    });

  } catch (error) {
    console.error('Confirm resolution error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  getComplaintsByTenantId,
  getComplaintsByConsumerId,
  assignComplaint,
  updateComplaintStatus,
  addComplaintUpdate,
  confirmResolution
};