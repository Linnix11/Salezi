// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Transactions } from './pages/Transactions';
import { Administration } from './pages/Administration';
import { Profile } from './pages/Profile';
import { useAuth } from './hooks/useAuth';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// 404 Page Component
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="text-xl text-gray-600 mt-4">Page not found</p>
        <Link 
          to="/"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#059669',
              },
            },
            error: {
              style: {
                background: '#DC2626',
              },
            },
          }}
        />
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route element={<Layout />}>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/products" 
              element={
                <ProtectedRoute roles={['super-admin', 'manager', 'seller']}>
                  <Products />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/transactions" 
              element={
                <ProtectedRoute roles={['super-admin', 'manager', 'seller']}>
                  <Transactions />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin" 
              element={
                <ProtectedRoute roles={['super-admin', 'manager']}>
                  <Administration />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            {/* Catch all route - 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;