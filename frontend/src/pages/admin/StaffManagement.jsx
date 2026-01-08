import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tenantAPI, userAPI } from '../../services/api';

const StaffManagement = () => {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tenantsRes, usersRes] = await Promise.all([
        tenantAPI.getAll(),
        userAPI.getAll()
      ]);
      setTenants(tenantsRes.data.data.tenants);
      setUsers(usersRes.data.data.users || []);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading staff...</p>
        </div>
      </div>
    );
  }

  // Filter users based on selected tenant and role
  const filteredUsers = users.filter(user => {
    const tenantMatch = !selectedTenant || user.tenant_id === selectedTenant;
    const roleMatch = roleFilter === 'all' || user.role === roleFilter;
    return tenantMatch && roleMatch;
  });

  const getRoleName = (role) => {
    const roleNames = {
      ha: 'Helpdesk Agent',
      sp: 'Support Person',
      hm: 'Helpdesk Manager',
      consumer: 'Consumer'
    };
    return roleNames[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      ha: 'from-blue-100 to-blue-200 text-blue-800 border-blue-300',
      sp: 'from-green-100 to-green-200 text-green-800 border-green-300',
      hm: 'from-purple-100 to-purple-200 text-purple-800 border-purple-300',
      consumer: 'from-gray-100 to-gray-200 text-gray-800 border-gray-300'
    };
    return colors[role] || 'from-gray-100 to-gray-200 text-gray-800 border-gray-300';
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'ha':
        return (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'sp':
        return (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'hm':
        return (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Staff Management</h1>
          <p className="text-gray-600">View and manage all staff members and consumers</p>
        </div>

        {/* Tenant Filter Buttons */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Filter by Tenant</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedTenant(null)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                !selectedTenant
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-400'
              }`}
            >
              All Tenants ({users.length})
            </button>
            {tenants.map((tenant) => {
              const tenantUsersCount = users.filter(u => u.tenant_id === tenant.id).length;
              return (
                <button
                  key={tenant.id}
                  onClick={() => setSelectedTenant(tenant.id)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    selectedTenant === tenant.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-400'
                  }`}
                >
                  {tenant.name} ({tenantUsersCount})
                </button>
              );
            })}
          </div>
        </div>

        {/* Role Filter Buttons */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Filter by Role</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                roleFilter === 'all'
                  ? 'bg-gray-700 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              All Roles
            </button>
            <button
              onClick={() => setRoleFilter('ha')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                roleFilter === 'ha'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
              }`}
            >
              Helpdesk Agents
            </button>
            <button
              onClick={() => setRoleFilter('sp')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                roleFilter === 'sp'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-green-400'
              }`}
            >
              Support Persons
            </button>
            <button
              onClick={() => setRoleFilter('hm')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                roleFilter === 'hm'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-400'
              }`}
            >
              Managers
            </button>
            <button
              onClick={() => setRoleFilter('consumer')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                roleFilter === 'consumer'
                  ? 'bg-gray-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              Consumers
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-700 font-medium">
            Showing <span className="text-purple-600 font-bold">{filteredUsers.length}</span> user(s)
          </p>
        </div>

        {/* Users Grid */}
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => {
              const userTenant = tenants.find(t => t.id === user.tenant_id);
              return (
                <div
                  key={user.id}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-purple-300 hover:-translate-y-1 duration-300"
                >
                  {/* User Avatar with Role Icon */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${
                      user.role === 'ha' ? 'from-blue-500 to-blue-700' :
                      user.role === 'sp' ? 'from-green-500 to-green-700' :
                      user.role === 'hm' ? 'from-purple-500 to-purple-700' :
                      'from-gray-500 to-gray-700'
                    } rounded-xl flex items-center justify-center shadow-lg`}>
                      {getRoleIcon(user.role)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">
                        {user.first_name} {user.last_name}
                      </h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <div className="mb-3">
                    <span className={`px-3 py-1.5 bg-gradient-to-r rounded-full text-sm font-semibold border inline-block ${getRoleColor(user.role)}`}>
                      {getRoleName(user.role)}
                    </span>
                  </div>

                  {/* Tenant Info */}
                  {userTenant && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-3">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Organization</p>
                      <p className="text-sm font-bold text-gray-800">{userTenant.name}</p>
                      <p className="text-xs text-gray-600 capitalize">{userTenant.type}</p>
                    </div>
                  )}

                  {/* User ID */}
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-xs text-gray-500">User ID: {user.id}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Users Found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffManagement;