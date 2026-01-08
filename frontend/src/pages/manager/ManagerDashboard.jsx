import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintAPI, userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ComplaintCard from '../../components/ComplaintCard';
import StatCard from '../../components/StatCard';
import AlertCard from '../../components/AlertCard';
import ViewTabButton from '../../components/ViewTabButton';
import ViewSection from '../../components/ViewSection';




const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('overview'); // overview, complaints, performance

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [complaintsRes, usersRes] = await Promise.all([
        complaintAPI.getByTenantId(user.tenant_id),
        userAPI.getByTenant(user.tenant_id)
      ]);
      setComplaints(complaintsRes.data.data.complaints);
      setUsers(usersRes.data.data.users);
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
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }



  // Analytics Calculations
  const supportPersons = users.filter(u => u.role === 'sp');
  const helpdeskAgents = users.filter(u => u.role === 'ha');
  
  const totalComplaints = complaints.length;
  const activeComplaints = complaints.filter(c => ['assigned', 'in_progress'].includes(c.status));
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved');
  const unassignedComplaints = complaints.filter(c => c.status === 'logged');
  const overdueComplaints = complaints.filter(c => {
    if (c.status === 'resolved' || c.status === 'closed') return false;
    const daysSinceCreation = Math.floor((new Date() - new Date(c.created_at)) / (1000 * 60 * 60 * 24));
    return daysSinceCreation > 3; // More than 3 days is overdue
  });

  // Average Resolution Time
  const avgResolutionTime = resolvedComplaints.length > 0
    ? resolvedComplaints.reduce((acc, c) => {
        if (c.resolved_at) {
          const days = Math.floor((new Date(c.resolved_at) - new Date(c.created_at)) / (1000 * 60 * 60 * 24));
          return acc + days;
        }
        return acc;
      }, 0) / resolvedComplaints.length
    : 0;

  // Support Person Performance
  const spPerformance = supportPersons.map(sp => {
    const spComplaints = complaints.filter(c => c.assigned_to === sp.id);
    const spResolved = spComplaints.filter(c => c.status === 'resolved');
    const spActive = spComplaints.filter(c => ['assigned', 'in_progress'].includes(c.status));
    
    const avgTime = spResolved.length > 0
      ? spResolved.reduce((acc, c) => {
          if (c.resolved_at) {
            const days = Math.floor((new Date(c.resolved_at) - new Date(c.created_at)) / (1000 * 60 * 60 * 24));
            return acc + days;
          }
          return acc;
        }, 0) / spResolved.length
      : 0;

    return {
      ...sp,
      totalAssigned: spComplaints.length,
      resolved: spResolved.length,
      active: spActive.length,
      avgResolutionTime: avgTime,
      resolutionRate: spComplaints.length > 0 ? ((spResolved.length / spComplaints.length) * 100).toFixed(1) : 0
    };
  }).sort((a, b) => b.resolved - a.resolved);

  // Helpdesk Agent Performance
  const haPerformance = helpdeskAgents.map(ha => {
    const assignedByAgent = complaints.filter(c => c.status !== 'logged');
    return {
      ...ha,
      complaintsAssigned: assignedByAgent.length
    };
  });

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "support-persons", label: "👥 Support Persons" },
    { id: "agents", label: "🎯 Helpdesk Agents" },
    { id: "unassigned", label: `⚠️ Unassigned (${unassignedComplaints.length})` },
    { id: "overdue", label: `🔥 Overdue (${overdueComplaints.length})` },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Manager Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.first_name}! Monitor team performance and complaint resolution</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Complaints */}
          <StatCard title="Total Complaints" count={totalComplaints} class="from-blue-500 to-blue-700" />

          {/* Active Complaints */}
          <StatCard title="Active" count={activeComplaints.length} class="from-yellow-500 to-yellow-700" />

          {/* Resolved Complaints */}
          <StatCard
            title="Resolved"
            count={resolvedComplaints.length}
            click={
              totalComplaints > 0
                ? `${((resolvedComplaints.length / totalComplaints) * 100).toFixed(1)}% resolution rate`
                : "0% resolution rate"
            }
            class="from-green-500 to-green-700"
          />

          {/* Avg Resolution Time */}
          <StatCard
            title="Avg Resolution"
            count={avgResolutionTime.toFixed(1)}
            click="days"
            class="from-purple-500 to-purple-700"
          />
        </div>

        {/* Alert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Unassigned Complaints Alert */}
          {unassignedComplaints.length > 0 && (
            <AlertCard
              title="Unassigned Complaints"
              count={unassignedComplaints.length}
              description="complaint(s) need to be assigned"
              onClick={() => setSelectedView('unassigned')}
              bgColor="bg-orange-50"
              borderColor="border-orange-500"
              textColor="text-orange-600"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
            />

          )}

          {/* Overdue Complaints Alert */}
          {overdueComplaints.length > 0 && (
            <AlertCard
                  title="Overdue Complaints"
                  count={overdueComplaints.length}
                  description="complaint(s) overdue (>3 days)"
                  onClick={() => setSelectedView('overdue')}
                  bgColor="bg-red-50"
                  borderColor="border-red-500"
                  textColor="text-red-600"
                  icon={
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
          />
          )}
        </div>

        {/* View Tabs */}
        
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <ViewTabButton
              key={tab.id}
              label={tab.label}
              active={selectedView === tab.id}
              onClick={() => setSelectedView(tab.id)}
            />
          ))}
        </div>
        

        {/* Content Based on Selected View */}
        <ViewSection name="overview" selected={selectedView}>
        <h1>Overview Content</h1>
      </ViewSection>
        {selectedView === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Team Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Support Persons</span>
                  <span className="text-2xl font-bold text-blue-600">{supportPersons.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Helpdesk Agents</span>
                  <span className="text-2xl font-bold text-green-600">{helpdeskAgents.length}</span>
                </div>
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Status Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Logged</span>
                  <span className="font-bold text-gray-800">{unassignedComplaints.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-500 h-2 rounded-full" style={{width: `${(unassignedComplaints.length / totalComplaints * 100) || 0}%`}}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Assigned</span>
                  <span className="font-bold text-blue-800">{complaints.filter(c => c.status === 'assigned').length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: `${(complaints.filter(c => c.status === 'assigned').length / totalComplaints * 100) || 0}%`}}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">In Progress</span>
                  <span className="font-bold text-yellow-800">{complaints.filter(c => c.status === 'in_progress').length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${(complaints.filter(c => c.status === 'in_progress').length / totalComplaints * 100) || 0}%`}}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Resolved</span>
                  <span className="font-bold text-green-800">{resolvedComplaints.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: `${(resolvedComplaints.length / totalComplaints * 100) || 0}%`}}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'support-persons' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Support Person Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spPerformance.map((sp) => (
                <div key={sp.id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {sp.first_name[0]}{sp.last_name[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{sp.first_name} {sp.last_name}</h3>
                      <p className="text-sm text-gray-600">{sp.email}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm text-gray-700">Total Assigned</span>
                      <span className="text-xl font-bold text-blue-600">{sp.totalAssigned}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-gray-700">Resolved</span>
                      <span className="text-xl font-bold text-green-600">{sp.resolved}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm text-gray-700">Active</span>
                      <span className="text-xl font-bold text-yellow-600">{sp.active}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm text-gray-700">Avg Resolution</span>
                      <span className="text-xl font-bold text-purple-600">{sp.avgResolutionTime.toFixed(1)}d</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600">Resolution Rate</span>
                        <span className="text-xs font-bold text-gray-800">{sp.resolutionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: `${sp.resolutionRate}%`}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedView === 'agents' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Helpdesk Agent Activity</h2>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Agent</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {haPerformance.map((agent) => (
                    <tr key={agent.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {agent.first_name[0]}{agent.last_name[0]}
                          </div>
                          <span className="font-medium text-gray-800">{agent.first_name} {agent.last_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{agent.email}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedView === 'unassigned' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Unassigned Complaints ({unassignedComplaints.length})</h2>
            {unassignedComplaints.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unassignedComplaints.map((complaint) => (
                  <ComplaintCard key={complaint.id} complaint={complaint} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-md">
                <svg className="w-16 h-16 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 text-lg">All complaints have been assigned!</p>
              </div>
            )}
          </div>
        )}

        {selectedView === 'overdue' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Overdue Complaints ({overdueComplaints.length})</h2>
            {overdueComplaints.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {overdueComplaints.map((complaint) => (
                  <ComplaintCard key={complaint.id} complaint={complaint} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-md">
                <svg className="w-16 h-16 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 text-lg">No overdue complaints!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;