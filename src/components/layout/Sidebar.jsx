// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home,
  Package,
  ShoppingCart,
  Settings,
  Users
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = () => {
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, allowedRoles: ['all'] },
    { 
      name: 'Products', 
      href: '/products', 
      icon: Package, 
      allowedRoles: ['super-admin', 'manager', 'seller'] 
    },
    { 
      name: 'Transactions', 
      href: '/transactions', 
      icon: ShoppingCart, 
      allowedRoles: ['super-admin', 'manager', 'seller'] 
    },
    { 
      name: 'Administration', 
      href: '/admin', 
      icon: Settings, 
      allowedRoles: ['super-admin', 'manager'] 
    }
  ];

  const isAllowed = (allowedRoles) => {
    return allowedRoles.includes('all') || allowedRoles.includes(user?.role);
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-800">
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => 
                isAllowed(item.allowedRoles) && (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="mr-3 h-6 w-6" />
                    {item.name}
                  </NavLink>
                )
              )}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};