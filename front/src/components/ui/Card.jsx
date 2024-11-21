import React from 'react';

export const Card = ({ children, className, ...props }) => (
  <div
    className={`bg-white rounded-lg shadow-md ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className, ...props }) => (
  <div
    className={`px-6 py-4 border-b border-gray-200 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h2
    className={`text-lg font-medium ${className}`}
    {...props}
  >
    {children}
  </h2>
);

export const CardContent = ({ children, className, ...props }) => (
  <div
    className={`p-6 ${className}`}
    {...props}
  >
    {children}
  </div>
);