const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ComplaintUpdate = sequelize.define('complaint_updates', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  complaint_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'complaints',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status_changed_to: {
    type: DataTypes.ENUM('logged', 'assigned', 'in_progress', 'resolved', 'closed'),
    allowNull: true
  },
  is_resolution: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  consumer_confirmed: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  consumer_feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: false  // Only created_at needed for updates
});

module.exports = ComplaintUpdate;