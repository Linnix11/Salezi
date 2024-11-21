import React from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, logout: logoutStore } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutStore();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">FNAC Management</h1>
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Notifications */}
            <div className="flex-shrink-0 relative">
              <button 
                type="button"
                className="relative p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Bell className="h-6 w-6 text-gray-400" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
              </button>
            </div>

            {/* User menu */}
            <div className="ml-4 relative flex items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {user?.username?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-1 text-sm text-red-600 hover:text-red-700 rounded-md hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};