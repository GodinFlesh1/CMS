const { Tenant, User } = require('../models/index');

// Create new tenant (Admin only)
const createTenant = async (req, res) => {
  try {
    const { name, type } = req.body;

    // Validation
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and type'
      });
    }

    const validTypes = ['bank', 'telecom', 'airline'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Must be: bank, telecom, or airline'
      });
    }

    // Check if tenant with same name already exists
    const existingTenant = await Tenant.findOne({ where: { name } });
    if (existingTenant) {
      return res.status(400).json({
        success: false,
        message: 'Tenant with this name already exists'
      });
    }

    // Create tenant
    const tenant = await Tenant.create({
      name,
      type,
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Tenant created successfully',
      data: { tenant }
    });

  } catch (error) {
    console.error('Create tenant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during tenant creation',
      error: error.message
    });
  }
};

// Get all tenants (Admin only)
const getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.findAll({
      attributes: ['id', 'name', 'type', 'status', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: { 
        tenants,
        count: tenants.length 
      }
    });

  } catch (error) {
    console.error('Get tenants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get single tenant by ID (Admin only)
const getTenantById = async (req, res) => {
  try {
    const { id } = req.params;

    const tenant = await Tenant.findByPk(id, {
      include: [{
        model: User,
        attributes: ['id', 'email', 'first_name', 'last_name', 'role', 'created_at']
      }]
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { tenant }
    });

  } catch (error) {
    console.error('Get tenant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update tenant (Admin only)
const updateTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, status } = req.body;

    const tenant = await Tenant.findByPk(id);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    // Validate type if provided
    if (type) {
      const validTypes = ['bank', 'telecom', 'airline'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid type. Must be: bank, telecom, or airline'
        });
      }
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['active', 'inactive'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be: active or inactive'
        });
      }
    }

    // Update tenant
    await tenant.update({
      ...(name && { name }),
      ...(type && { type }),
      ...(status && { status })
    });

    res.status(200).json({
      success: true,
      message: 'Tenant updated successfully',
      data: { tenant }
    });

  } catch (error) {
    console.error('Update tenant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during tenant update',
      error: error.message
    });
  }
};

// Delete tenant (Admin only - soft delete by setting status to inactive)
const deleteTenant = async (req, res) => {
  try {
    const { id } = req.params;

    const tenant = await Tenant.findByPk(id);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    await tenant.update({ status: 'inactive' });

    res.status(200).json({
      success: true,
      message: 'Tenant deactivated successfully',
      data: { tenant }
    });

  } catch (error) {
    console.error('Delete tenant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during tenant deletion',
      error: error.message
    });
  }
};

// Get active tenants only (Public - for consumer registration)
const getActiveTenants = async (req, res) => {
  try {
    const tenants = await Tenant.findAll({
      where: { status: 'active' },
      attributes: ['id', 'name', 'type'],
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: { 
        tenants,
        count: tenants.length 
      }
    });

  } catch (error) {
    console.error('Get active tenants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  createTenant,
  getAllTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
  getActiveTenants
};