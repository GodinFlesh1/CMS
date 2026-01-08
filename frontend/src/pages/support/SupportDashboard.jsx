import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ComplaintCard from '../../components/ComplaintCard';
import StatCard from '../../components/StatCard';

const SupportDashboard = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await complaintAPI.getAll();
      setComplaints(response.data.data.complaints);
    } catch (err) {
      console.error('Failed to fetch complaints', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!status || !note) {
      alert('Please provide status and note');
      return;
    }

    try {
      await complaintAPI.updateStatus(selectedComplaint.id, status, note);
      alert('Complaint updated successfully!');
      setSelectedComplaint(null);
      setNote('');
      setStatus('');
      fetchComplaints();
    } catch (err) {
      alert('Failed to update complaint');
    }
  };

  const { user } = useAuth();
  
  const activeComplaints = complaints.filter(
    c => ['assigned', 'in_progress'].includes(c.status) && c.assigned_to === user.id
  );

  const inProgressComplaints = activeComplaints.filter(c => c.status === 'in_progress');
  const assignedComplaints = activeComplaints.filter(c => c.status === 'assigned');
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved' && c.assigned_to === user.id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Support Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.first_name}! Manage your assigned complaints</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Assigned */}
          <StatCard title="Active Complaints" count={activeComplaints.length} class="from-blue-500 to-blue-700" />


          {/* In Progress */}
          <StatCard title="In Progress" count={inProgressComplaints.length} class="from-yellow-500 to-yellow-700" />


          {/* Resolved */}
          <StatCard title="Resolved" count={resolvedComplaints.length} class="from-green-500 to-green-700" />

        </div>

        {/* Update Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl max-w-lg w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Update Complaint</h3>
                <button
                  onClick={() => {
                    setSelectedComplaint(null);
                    setNote('');
                    setStatus('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Complaint Title</p>
                <p className="font-bold text-gray-800">{selectedComplaint.title}</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Update Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="">Select Status</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Add Note
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Describe what actions you've taken..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpdateStatus}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold shadow-lg hover:shadow-xl"
                >
                  Update Complaint
                </button>
                <button
                  onClick={() => {
                    setSelectedComplaint(null);
                    setNote('');
                    setStatus('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assigned (Not Started) Complaints */}
        {assignedComplaints.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              Newly Assigned ({assignedComplaints.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignedComplaints.map((complaint) => (
                <div key={complaint.id} className="flex flex-col gap-2">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => navigate(`/complaint/${complaint.id}`)}
                  >
                    <ComplaintCard complaint={complaint} />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedComplaint(complaint);
                      setStatus('in_progress');
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg"
                  >
                    Start Working
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* In Progress Complaints */}
        {inProgressComplaints.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></span>
              In Progress ({inProgressComplaints.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressComplaints.map((complaint) => (
                <div key={complaint.id} className="flex flex-col gap-2">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => navigate(`/complaint/${complaint.id}`)}
                  >
                    <ComplaintCard complaint={complaint} />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedComplaint(complaint);
                      setStatus('resolved');
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition font-medium shadow-md hover:shadow-lg"
                  >
                    Mark as Resolved
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resolved Complaints */}
        {resolvedComplaints.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Recently Resolved ({resolvedComplaints.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resolvedComplaints.map((complaint) => (
                <div 
                  key={complaint.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/complaint/${complaint.id}`)}
                >
                  <ComplaintCard complaint={complaint} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {activeComplaints.length === 0 && resolvedComplaints.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">You don't have any complaints assigned to you at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportDashboard;