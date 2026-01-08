import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tenantAPI, complaintAPI } from '../../services/api';
import ComplaintCard from '../../components/ComplaintCard';

const TotalComplaints = () => {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tenantsRes, complaintsRes] = await Promise.all([
        tenantAPI.getAll(),
        complaintAPI.getAll()
      ]);
      setTenants(tenantsRes.data.data.tenants);
      setComplaints(complaintsRes.data.data.complaints);
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading complaints...</p>
        </div>
      </div>
    );
  }

  // Filter complaints based on selected tenant and status
  const filteredComplaints = complaints.filter(complaint => {
    const tenantMatch = !selectedTenant || complaint.tenant_id === selectedTenant;
    const statusMatch = statusFilter === 'all' || complaint.status === statusFilter;
    return tenantMatch && statusMatch;
  });

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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">All Complaints</h1>
          <p className="text-gray-600">Filter complaints by tenant and status</p>
        </div>

        {/* Tenant Filter Buttons */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Filter by Tenant</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedTenant(null)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                !selectedTenant
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
              }`}
            >
              All Tenants ({complaints.length})
            </button>
            {tenants.map((tenant) => {
              const tenantComplaintsCount = complaints.filter(c => c.tenant_id === tenant.id).length;
              return (
                <button
                  key={tenant.id}
                  onClick={() => setSelectedTenant(tenant.id)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    selectedTenant === tenant.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {tenant.name} ({tenantComplaintsCount})
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Filter by Status</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-gray-700 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter('logged')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                statusFilter === 'logged'
                  ? 'bg-gray-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              Logged
            </button>
            <button
              onClick={() => setStatusFilter('assigned')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                statusFilter === 'assigned'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
              }`}
            >
              Assigned
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                statusFilter === 'in_progress'
                  ? 'bg-yellow-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-yellow-400'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                statusFilter === 'resolved'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-green-400'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-700 font-medium">
            Showing <span className="text-blue-600 font-bold">{filteredComplaints.length}</span> complaint(s)
          </p>
        </div>

        {/* Complaints Grid */}
        {filteredComplaints.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Complaints Found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalComplaints;