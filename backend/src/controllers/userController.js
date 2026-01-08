const { User, Tenant } = require('../models/index');

// Get all users in a tenant (Admin and Managers only)
const getUsersByTenant = async (req, res) => {
  try {
    const { tenant_id } = req.params;

    // If not admin, users can only see their own tenant
    if (req.user.role !== 'admin' && req.user.tenant_id != tenant_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view users from your organization'
      });
    }

    const users = await User.findAll({
      where: { tenant_id },
      attributes: { exclude: ['password_hash'] },
      include: [{
        model: Tenant,
        attributes: ['id', 'name', 'type']
      }],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: { 
        users,
        count: users.length 
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { role, tenant_id } = req.query;

    const whereClause = {};
    if (role) whereClause.role = role;
    if (tenant_id) whereClause.tenant_id = tenant_id;

    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password_hash'] },
      include: [{
        model: Tenant,
        attributes: ['id', 'name', 'type']
      }],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: { 
        users,
        count: users.length 
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
      include: [{
        model: Tenant,
        attributes: ['id', 'name', 'type']
      }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Non-admin users can only view their own profile or users from same tenant
    if (req.user.role !== 'admin') {
      if (req.user.id !== user.id && req.user.tenant_id !== user.tenant_id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update user (Admin or self)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Only admin or the user themselves can update
    if (req.user.role !== 'admin' && req.user.id != id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own profile'
      });
    }

    // Check if email already exists (if changing email)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Update user
    await user.update({
      ...(first_name && { first_name }),
      ...(last_name && { last_name }),
      ...(email && { email })
    });

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { 
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          tenant_id: user.tenant_id
        }
      }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Cannot delete admin users
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getUsersByTenant,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};