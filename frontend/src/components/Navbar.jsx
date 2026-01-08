import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const getDashboardLink = () => {
    switch (user.role) {
      case 'admin': return '/admin';
      case 'consumer': return '/consumer';
      case 'ha': return '/agent';
      case 'sp': return '/support';
      case 'hm': return '/manager';
      default: return '/';
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to={getDashboardLink()} className="text-xl font-bold">
            {/* {user.role === "hm" || user.role === "ha" 
              ? `CMS - ${user.tenant?.name || ""}` 
              : user.role === "consumer" 
                ? `CMS - ${user.tenant || ""}` 
                : "Admin Portal"} */}
                CMS - {user.tenant?.name || "Admin Portal"}
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm">
              {user.first_name} {user.last_name} 
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;