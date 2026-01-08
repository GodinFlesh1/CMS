import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ComplaintModal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchComplaintDetails();
  }, [id]);

  const fetchComplaintDetails = async () => {
    try {
      setLoading(true);
      const response = await complaintAPI.getById(id);
      setComplaint(response.data.data.complaint);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch complaint details', err);
      setError('Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    logged: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300',
    assigned: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300',
    in_progress: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300',
    resolved: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300',
    closed: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border border-gray-700',
  };

  const priorityColors = {
    low: 'text-green-600 bg-green-50 border-green-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    high: 'text-red-600 bg-red-50 border-red-200',
  };

  const priorityIcons = {
    low: '●',
    medium: '●●',
    high: '●●●',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-gray-800 text-xl font-semibold mb-4">{error || 'Complaint not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-4xl font-bold text-gray-800">Complaint Details</h1>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{complaint.title}</h2>
                <p className="text-blue-100 text-sm">Complaint ID: #{complaint.id}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${statusColors[complaint.status]}`}>
                {complaint.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Content Sections */}
          <div className="p-8 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                {complaint.description}
              </p>
            </div>

            {/* Priority and Date Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">Priority Level</h4>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold w-fit ${priorityColors[complaint.priority]}`}>
                  <span className="text-xl leading-none">{priorityIcons[complaint.priority]}</span>
                  <span className="capitalize text-lg">{complaint.priority}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">Created Date</h4>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-lg font-medium">
                    {new Date(complaint.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Consumer Information - Only show to non-consumers */}
            {user.role !== 'consumer' && complaint.consumer && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Consumer Information
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {complaint.consumer.first_name[0]}{complaint.consumer.last_name[0]}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-800">
                      {complaint.consumer.first_name} {complaint.consumer.last_name}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {complaint.consumer.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Assignee Information */}
            {complaint.assignee ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {user.role === 'consumer' ? 'Handled By' : 'Assigned Support Person'}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {complaint.assignee.first_name[0]}{complaint.assignee.last_name[0]}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-800">
                      {complaint.assignee.first_name} {complaint.assignee.last_name}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {complaint.assignee.email}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <p className="text-yellow-800 font-medium flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  This complaint has not been assigned yet
                </p>
              </div>
            )}

            {/* Updates Timeline - Different views for consumer vs staff */}
            {complaint.complaint_updates && complaint.complaint_updates.length > 0 && (
              <>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {user.role === 'consumer' ? 'Progress Timeline' : 'Updates Timeline'}
                </h3>

                {user.role === 'consumer' ? (
                  /* Consumer Timeline View - More visual and customer-friendly */
                  <div className="relative">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-green-500"></div>
                    
                    <div className="space-y-6">
                      {[...complaint.complaint_updates]
                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                      .map((update, index) => {

                        const isResolution = update.is_resolution || update.status_changed_to === 'resolved';
                        const isFirst = index === 0;
                        
                        return (
                          <div key={index} className="relative pl-20">
                            {/* Timeline Dot */}
                            <div className={`absolute left-5 w-6 h-6 rounded-full border-4 border-white shadow-lg ${
                              isResolution ? 'bg-green-500' : 
                              isFirst ? 'bg-blue-500' : 
                              'bg-gray-400'
                            }`}></div>
                            
                            {/* Update Card */}
                            <div className={`rounded-xl p-5 shadow-md border-l-4 ${
                              isResolution ? 'bg-green-50 border-green-500' :
                              isFirst ? 'bg-blue-50 border-blue-500' :
                              'bg-gray-50 border-gray-300'
                            }`}>
                              {/* Status Badge */}
                              {update.status_changed_to && (
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                                  update.status_changed_to === 'resolved' ? 'bg-green-200 text-green-800' :
                                  update.status_changed_to === 'in_progress' ? 'bg-yellow-200 text-yellow-800' :
                                  update.status_changed_to === 'assigned' ? 'bg-blue-200 text-blue-800' :
                                  'bg-gray-200 text-gray-800'
                                }`}>
                                  Status: {update.status_changed_to.replace('_', ' ')}
                                </span>
                              )}
                              
                              {/* Update Note */}
                              <p className="text-gray-800 font-medium mb-2">{update.note}</p>
                              
                              {/* Timestamp */}
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {new Date(update.created_at).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Staff Timeline View - More compact and information-dense */
                  <div className="space-y-4">
                    {[...complaint.complaint_updates]
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map((update, index) => (

                      <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                        {update.status_changed_to && (
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 ${
                            update.status_changed_to === 'resolved' ? 'bg-green-200 text-green-800' :
                            update.status_changed_to === 'in_progress' ? 'bg-yellow-200 text-yellow-800' :
                            update.status_changed_to === 'assigned' ? 'bg-blue-200 text-blue-800' :
                            'bg-gray-200 text-gray-800'
                          }`}>
                            → {update.status_changed_to.replace('_', ' ')}
                          </span>
                        )}
                        <p className="text-gray-700 mb-2">{update.note}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(update.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              </>
            )}

            {/* No updates message for consumers */}
            {/* {user.role === 'consumer' && (!complaint.complaint_updates|| complaint.complaint_updates.length === 0) && (
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-center">
                <svg className="w-12 h-12 text-blue-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-blue-800 font-medium">Your complaint is being processed</p>
                <p className="text-blue-600 text-sm mt-1">We'll update you as soon as there's progress</p>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintModal;