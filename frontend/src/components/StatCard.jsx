import React from 'react'
import { useNavigate } from 'react-router-dom';

const StatCard = (props) => {

    const navigate = useNavigate();

  return (
    <div 
    className={`bg-gradient-to-br ${props.class} p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer hover:-translate-y-2 transform duration-300 group`}
    onClick={() => navigate(props.route)}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
    </div>
    <h3 className="text-white text-opacity-90 text-lg font-medium mb-2">{props.title}</h3>
    <p className="text-5xl font-bold text-white">{props.count}</p>
    <p className="text-purple-100 text-sm mt-2">{props.click ? `${props.click}`: "" }</p>
  </div>
  )
}

export default StatCard