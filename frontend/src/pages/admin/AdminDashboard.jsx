import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tenantAPI, complaintAPI, authAPI, userAPI } from '../../services/api';
import StatCard from '../../components/StatCard';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [showTenantForm, setShowTenantForm] = useState(false);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [tenantForm, setTenantForm] = useState({ name: '', type: 'bank' });
  const [staffForm, setStaffForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'ha',
    tenant_id: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tenantsRes, complaintsRes, usersRes] = await Promise.all([
        tenantAPI.getAll(),
        complaintAPI.getAll(),
        userAPI.getAll()
      ]);
      setTenants(tenantsRes.data.data.tenants);
      setComplaints(complaintsRes.data.data.complaints);
      setUsers(usersRes.data.data.users || []);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTenant = async (e) => {
    e.preventDefault();
    try {
      await tenantAPI.create(tenantForm);
      alert('Tenant created successfully!');
      setTenantForm({ name: '', type: 'bank' });
      setShowTenantForm(false);
      fetchData();
    } catch (err) {
      alert('Failed to create tenant');
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      await authAPI.createStaff(staffForm);
      alert('Staff user created successfully!');
      setStaffForm({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'ha',
        tenant_id: ''
      });
      setShowStaffForm(false);
      fetchData();
    } catch (err) {
      alert('Failed to create staff user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const staffCount = users.filter(u => u.role === 'ha' || u.role === 'sp' || u.role === 'hm').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-10 mt-5 text-gray-800">
          Welcome to Admin Portal
        </h1>

      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Tenants Card */}
          <StatCard title="Total Tenants" count={tenants.length} click="view by tenants" route="/admin/tenants" class="from-blue-500 to-blue-700"  />


          {/* Total Complaints Card */}
          <StatCard title="Total Complaints" count={complaints.length} click="view details" route="/admin/complaints" class="from-green-500 to-green-700"  />


          {/* Staff Members Card */}
          <StatCard title="Staff Members" count={staffCount} click="manage staff" route="/admin/staff" class="from-purple-500 to-purple-700"  />
         
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowTenantForm(!showTenantForm)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Tenant
          </button>
          <button
            onClick={() => setShowStaffForm(!showStaffForm)}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Staff User
          </button>
        </div>

        {/* Create Tenant Form */}
        {showTenantForm && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Tenant</h2>
            <form onSubmit={handleCreateTenant}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Tenant Name"
                  value={tenantForm.name}
                  onChange={(e) => setTenantForm({ ...tenantForm, name: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <select
                  value={tenantForm.type}
                  onChange={(e) => setTenantForm({ ...tenantForm, type: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="bank">Bank</option>
                  <option value="telecom">Telecom</option>
                  <option value="airline">Airline</option>
                </select>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Create Tenant
                </button>
                <button
                  type="button"
                  onClick={() => setShowTenantForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Create Staff Form */}
        {showStaffForm && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Staff User</h2>
            <form onSubmit={handleCreateStaff}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={staffForm.first_name}
                  onChange={(e) => setStaffForm({ ...staffForm, first_name: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={staffForm.last_name}
                  onChange={(e) => setStaffForm({ ...staffForm, last_name: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={staffForm.password}
                  onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <select
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="ha">Helpdesk Agent</option>
                  <option value="sp">Support Person</option>
                  <option value="hm">Helpdesk Manager</option>
                </select>
                <select
                  value={staffForm.tenant_id}
                  onChange={(e) => setStaffForm({ ...staffForm, tenant_id: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Tenant</option>
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Create Staff User
                </button>
                <button
                  type="button"
                  onClick={() => setShowStaffForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Recent Activity</h3>
            <p className="text-gray-600 text-sm">
              {complaints.filter(c => {
                const createdDate = new Date(c.created_at);
                const today = new Date();
                const diffTime = Math.abs(today - createdDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 7;
              }).length} new complaints this week
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Active Tenants</h3>
            <p className="text-gray-600 text-sm">
              {tenants.filter(t => t.status === 'active').length} of {tenants.length} tenants active
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Pending Complaints</h3>
            <p className="text-gray-600 text-sm">
              {complaints.filter(c => c.status === 'logged').length} unassigned complaints
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;