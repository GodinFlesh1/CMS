import React from 'react';
import { useNavigate } from 'react-router-dom';

const ComplaintCard = ({ complaint }) => {
  const navigate = useNavigate();

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

  return (
    <div
      className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-300 hover:-translate-y-1 group h-full flex flex-col"
      onClick={() => navigate(`/complaint/${complaint.id}`)}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-3 gap-3">
        <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
          {complaint.title}
        </h3>
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm ${statusColors[complaint.status]}`}>
          {complaint.status.replace('_', ' ')}
        </span>
      </div>

      {/* Description - shows 2 lines with ellipsis */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
        {complaint.description}
      </p>

      {/* Spacer to push footer to bottom */}
      <div className="flex-grow"></div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-3"></div>

      {/* Footer Section */}
      <div className="flex justify-between items-center text-xs mb-3">
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-medium ${priorityColors[complaint.priority]}`}>
          <span className="text-base leading-none">{priorityIcons[complaint.priority]}</span>
          <span className="capitalize">{complaint.priority}</span>
        </div>
        <span className="text-gray-500 flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(complaint.created_at).toLocaleDateString()}
        </span>
      </div>

      {/* Assignee */}
      {complaint.assignee && (
        <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-lg border border-blue-100">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-sm">
            {complaint.assignee.first_name[0]}{complaint.assignee.last_name[0]}
          </div>
          <span className="text-gray-700 font-medium">
            {complaint.assignee.first_name} {complaint.assignee.last_name}
          </span>
        </div>
      )}
    </div>
  );
};

export default ComplaintCard;