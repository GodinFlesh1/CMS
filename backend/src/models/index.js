const Tenant = require('./Tenant');
const User = require('./User');
const Complaint = require('./Complaint');
const ComplaintUpdate = require('./ComplaintUpdate');

// Define relationships
Tenant.hasMany(User, { foreignKey: 'tenant_id' });
User.belongsTo(Tenant, { foreignKey: 'tenant_id' });

Tenant.hasMany(Complaint, { foreignKey: 'tenant_id' });
Complaint.belongsTo(Tenant, { foreignKey: 'tenant_id' });

User.hasMany(Complaint, { foreignKey: 'consumer_id', as: 'complaints' });
Complaint.belongsTo(User, { foreignKey: 'consumer_id', as: 'consumer' });

User.hasMany(Complaint, { foreignKey: 'assigned_to', as: 'assignedComplaints' });
Complaint.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

Complaint.hasMany(ComplaintUpdate, { foreignKey: 'complaint_id' });
ComplaintUpdate.belongsTo(Complaint, { foreignKey: 'complaint_id' });

User.hasMany(ComplaintUpdate, { foreignKey: 'user_id' });
ComplaintUpdate.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  Tenant,
  User,
  Complaint,
  ComplaintUpdate
};