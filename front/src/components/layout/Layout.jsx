import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';

const Layout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/signin');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl">FNAC</span>
              {user && (
                <div className="ml-10 flex space-x-8">
                  <Link to="/" className="text-gray-600 hover:text-gray-900">
                    Dashboard
                  </Link>
                  <Link to="/products" className="text-gray-600 hover:text-gray-900">
                    Products
                  </Link>
                  <Link to="/transactions" className="text-gray-600 hover:text-gray-900">
                    Transactions
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center">
              {user ? (
                <UserMenu user={user} />
              ) : (
                <button
                  onClick={() => navigate('/signin')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;