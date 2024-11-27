import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Products from './components/products/Products';
import Transactions from './components/transactions/Transactions';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </Layout>
  );
}

export default App;