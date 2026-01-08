import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintAPI } from '../../services/api';
import ComplaintCard from '../../components/ComplaintCard';

const ConsumerDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await complaintAPI.getByConsumerId(user.id);
      setComplaints(response.data.data.complaints);
    } catch (err) {
      console.error('Failed to fetch complaints', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-10 mt-5">Welcome to consumer portal</h1>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Complaints</h3>
          <p className="text-3xl font-bold">
            {complaints.length}
          </p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">In Progress Complaints</h3>
          <p className="text-3xl font-bold">
          {complaints.filter(c => c.status === 'in_progress').length}
          </p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Resolved Complaints</h3>
          <p className="text-3xl font-bold">
            {complaints.filter(c => c.status === 'resolved').length}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Complaints</h1>
        <button
          onClick={() => navigate('/consumer/new-complaint')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Complaint
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No complaints yet. Create your first complaint!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {complaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsumerDashboard;
