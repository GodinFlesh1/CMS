import React, { useState, useEffect } from 'react';
import { complaintAPI, userAPI } from '../../services/api';
import ComplaintCard from '../../components/ComplaintCard';
import { useAuth } from '../../context/AuthContext';

const AgentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [supportPersons, setSupportPersons] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [assignTo, setAssignTo] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [complaintsRes, usersRes] = await Promise.all([
        // complaintAPI.getAll(),
        complaintAPI.getByTenantId(user.tenant_id),
        userAPI.getByTenant(user.tenant_id)
      ]);

      
      setComplaints(complaintsRes.data.data.complaints);
      
      // // Filter support persons
      const supports = usersRes.data.data.users.filter(
        u => u.role === 'sp'
      );
      setSupportPersons(supports);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!assignTo || !selectedComplaint) return;
    
    try {
      await complaintAPI.assign(selectedComplaint.id, assignTo);
      alert('Complaint assigned successfully!');
      setSelectedComplaint(null);
      setAssignTo('');
      fetchData();
    } catch (err) {
      alert('Failed to assign complaint');
    }
  };

  const unassignedComplaints = complaints.filter(c => c.status === 'logged');
  const assignedComplaints = complaints.filter(c => c.status !== 'logged' && c.status !== 'closed');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-10 mt-5 ">
        {user.role == "hm" 
              ? ` Manager` 
              : "Helpdesk Agent"} Dashboard</h1>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          {/* Assign Modal */}
          {selectedComplaint && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Assign Complaint</h3>
                <p className="mb-4">
                  <strong>Title:</strong> {selectedComplaint.title}
                </p>
                <select
                  value={assignTo}
                  onChange={(e) => setAssignTo(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg mb-4"
                >
                  <option value="">Select Support Person</option>
                  {supportPersons.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.first_name} {person.last_name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleAssign}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Assign
                  </button>
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Unassigned Complaints */}
          <div className="mb-8 ">
          <h2 className="text-2xl font-bold mb-8 flex justify-center p-2 relative w-fit mx-auto">
              Unassigned Complaints ({unassignedComplaints.length})
              <span className="absolute left-1/2 -bottom-1 h-1 w-full  -translate-x-1/2 bg-purple-600 rounded "></span>
            </h2>
            {unassignedComplaints.length === 0 ? (
              <p className="text-gray-500">No unassigned complaints</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unassignedComplaints.map((complaint) => (
                  <div key={complaint.id} className="flex flex-col gap-2">
                    <div className="flex-1">
                      <ComplaintCard complaint={complaint} />
                    </div>
                    <button
                      onClick={() => setSelectedComplaint(complaint)}
                      className="bg-blue-600 text-white px-3 py-1 w-full rounded text-sm hover:bg-blue-700"
                    >
                      Assign
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assigned Complaints */}
          <div className='mt-20'>
          <h2 className="text-2xl font-bold mb-8 flex justify-center p-2 relative w-fit mx-auto">
              Active Complaints ({assignedComplaints.length})
              <span className="absolute left-1/2 -bottom-1 h-1 w-full  -translate-x-1/2 bg-purple-600 rounded "></span>
            </h2>
            {assignedComplaints.length === 0 ? (
              <p className="text-gray-500">No active complaints</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignedComplaints.map((complaint) => (
                  <div key={complaint.id} className="h-full">
                    <ComplaintCard key={complaint.id} complaint={complaint} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AgentDashboard;