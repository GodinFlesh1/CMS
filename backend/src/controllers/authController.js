const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Tenant } = require('../models/index');

// Public registration - only for consumers
const registerConsumer = async (req, res) => {
  try {
    const { email, password, first_name, last_name, tenant_id } = req.body;

    if (!email || !password || !first_name || !last_name || !tenant_id) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this email already exists' 
      });
    }


    const tenant = await Tenant.findByPk(tenant_id);
    if (!tenant) {
      return res.status(404).json({ 
        success: false,
        message: 'Tenant not found' 
      });
    }
    if (tenant.status !== 'active') {
      return res.status(400).json({ 
        success: false,
        message: 'Tenant is not active' 
      });
    }


    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

   //public route only for consumer
    const user = await User.create({
      email,
      password_hash,
      first_name,
      last_name,
      role: 'consumer',
      tenant_id
    });


    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        tenant_id: user.tenant_id 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );


    res.status(201).json({
      success: true,
      message: 'Consumer registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          tenant_id: user.tenant_id,
          tenant: tenant ? {
            id: tenant.id,
            name: tenant.name,
            type: tenant.type
          } : null
          
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration',
      error: error.message 
    });
  }
};

// Admin creates staff users (ha, support_person, helpdesk_manager)
// This requires admin authentication
const createStaffUser = async (req, res) => {
  try {
    const { email, password, first_name, last_name, role, tenant_id } = req.body;

    if (!email || !password || !first_name || !last_name || !role || !tenant_id) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }

    // Validate role - CANNOT create admin or consumer via this endpoint
    const allowedRoles = ['ha', 'sp', 'hm'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid role. Allowed roles: ha(ha), sp(support_person), hm(helpdesk_manager)' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this email already exists' 
      });
    }

    // Verify tenant exists and is active
    const tenant = await Tenant.findByPk(tenant_id);
    if (!tenant) {
      return res.status(404).json({ 
        success: false,
        message: 'Tenant not found' 
      });
    }
    if (tenant.status !== 'active') {
      return res.status(400).json({ 
        success: false,
        message: 'Tenant is not active' 
      });
    }

    
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create staff user
    const user = await User.create({
      email,
      password_hash,
      first_name,
      last_name,
      role,
      tenant_id
    });

    res.status(201).json({
      success: true,
      message: 'Staff user created successfully',
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
    console.error('Create staff user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during user creation',
      error: error.message 
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password' 
      });
    }

    // Find user
    const user = await User.findOne({ 
      where: { email },
      include: [{
        model: Tenant,
        attributes: ['id', 'name', 'type', 'status']
      }]
    });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check if tenant is active (for non-admin users)
    if (user.tenant_id && user.tenant && user.tenant.status !== 'active') {
      return res.status(403).json({ 
        success: false,
        message: 'Your organization account is inactive' 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        tenant_id: user.tenant_id 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          tenant_id: user.tenant_id,
          tenant: user.tenant ? {
            id: user.tenant.id,
            name: user.tenant.name,
            type: user.tenant.type
          } : null
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login',
      error: error.message 
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] },
      include: [{
        model: Tenant,
        attributes: ['id', 'name', 'type', 'status']
      }]
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

module.exports = {
  registerConsumer,
  createStaffUser,
  login,
  getProfile
};