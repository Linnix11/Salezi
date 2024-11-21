import React, { useState, useEffect } from 'react';
import { Bell, Settings, Package, ShoppingCart, Users, Plus, Minus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Dashboard = () => {
  const [userData, setUserData] = useState({ role: 'user' });
  const [data, setData] = useState({
    products: [],
    transactions: []
  });

  // Récupérer les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch('/api/products');
        const transactionsResponse = await fetch('/api/transactions');
        const productsData = await productsResponse.json();
        const transactionsData = await transactionsResponse.json();
        setData({
          products: productsData,
          transactions: transactionsData
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };
    fetchData();
  }, []);

  // Stats Overview
  const stats = {
    totalProducts: data.products.length,
    lowStock: data.products.filter(p => p.stock < 10).length,
    pendingTransactions: data.transactions.filter(t => t.status === 'pending').length
  };

  // Fonction pour mettre à jour le statut d'une transaction
  const updateTransactionStatus = async (transactionId, newStatus) => {
    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        // Mettre à jour les données locales
        setData(prevData => ({
          ...prevData,
          transactions: prevData.transactions.map(t =>
            t.id === transactionId ? { ...t, status: newStatus } : t
          )
        }));
      } else {
        console.error('Erreur lors de la mise à jour du statut de la transaction.');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la transaction:', error);
    }
  };

  // Fonction pour mettre à jour le stock d'un produit
  const updateProductStock = async (productId, newStock) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stock: newStock })
      });
      if (response.ok) {
        // Mettre à jour les données locales
        setData(prevData => ({
          ...prevData,
          products: prevData.products.map(p =>
            p.id === productId ? { ...p, stock: newStock } : p
          )
        }));
      } else {
        console.error('Erreur lors de la mise à jour du stock du produit.');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock du produit:', error);
    }
  };

  // Fonction pour ajouter un nouveau produit
  const addProduct = async (product) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });
      if (response.ok) {
        const newProduct = await response.json();
        setData(prevData => ({
          ...prevData,
          products: [...prevData.products, newProduct]
        }));
      } else {
        console.error('Erreur lors de l\'ajout du produit.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1a1f36] text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">FNAC Management</h1>

            <div className="flex items-center space-x-6">
              {/* Admin Access Button */}
              {(userData?.role === 'super-admin' || userData?.role === 'manager') && (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Panel
                </button>
              )}

              {/* Notifications */}
              <button className="relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 text-xs flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-4">
                <span>{userData?.username}</span>
                <button
                  onClick={() => setUserData({ role: 'user' })}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Low Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.lowStock}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.pendingTransactions}</p>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <button
              onClick={() => addProduct({ name: 'New Product', type: 'Electronics', stock: 10, seller: 'FNAC Direct' })}
              className="flex items-center bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => updateProductStock(product.id, product.stock - 1)}
                            className="text-red-500 hover:text-red-600 mr-2"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.stock > 10 
                              ? 'bg-green-100 text-green-800'
                              : product.stock > 0
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.stock} units
                          </span>
                          <button
                            onClick={() => updateProductStock(product.id, product.stock + 1)}
                            className="text-green-500 hover:text-green-600 ml-2"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.seller}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* Ajoutez ici les actions supplémentaires pour les produits */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap">#{transaction.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{transaction.product}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status}
                        </span>
                        {transaction.status === 'pending' && (
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={() => updateTransactionStatus(transaction.id, 'completed')}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                            >
                              Mark as Completed
                            </button>
                            <button
                              onClick={() => updateTransactionStatus(transaction.id, 'cancelled')}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm ml-2"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{transaction.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{transaction.seller}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;