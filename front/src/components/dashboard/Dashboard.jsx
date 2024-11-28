import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Mail, DollarSign, Users } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    sales: 0,
    vendors: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [transactionStats, setTransactionStats] = useState([]);

  const COLORS = {
    validated: '#4CAF50',
    refused: '#f44336',
    pending: '#FF9800'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, transactionsRes, vendorsRes] = await Promise.all([
          fetch('http://localhost:1337/api/products'),
          fetch('http://localhost:1337/api/transactions'),
          fetch('http://localhost:1337/api/vendors')
        ]);

        const products = await productsRes.json();
        const transactions = await transactionsRes.json();
        const vendors = await vendorsRes.json();

        setStats({
          products: products.data?.length || 0,
          sales: transactions.data?.length || 0,
          vendors: vendors.data?.length || 0
        });

        const formattedTransactions = transactions.data?.map(t => ({
          id: t.id,
          order_status: t.order_status,
          quantity: t.quantity,
          price: t.total_price,
          date: new Date(t.date).toLocaleDateString()
        })) || [];

        setRecentTransactions(formattedTransactions);

        const stats = formattedTransactions.reduce((acc, transaction) => {
          const status = transaction.order_status;
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const pieData = [
          { name: 'Validated', value: stats.validated || 0, color: COLORS.validated },
          { name: 'Refused', value: stats.refused || 0, color: COLORS.refused },
          { name: 'Pending', value: stats.pending || 0, color: COLORS.pending }
        ];

        setTransactionStats(pieData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    return {
      validated: 'bg-green-100 text-green-800',
      refused: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    }[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-blue-600 text-sm">Total Products</h3>
              <p className="text-2xl font-semibold mt-2">{stats.products}</p>
            </div>
            <div className="bg-blue-100/50 p-2 rounded-full">
              <Mail className="text-blue-600 h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-green-600 text-sm">Total Transactions</h3>
              <p className="text-2xl font-semibold mt-2">{stats.sales}</p>
            </div>
            <div className="bg-green-100/50 p-2 rounded-full">
              <DollarSign className="text-green-600 h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-purple-600 text-sm">Active Vendors</h3>
              <p className="text-2xl font-semibold mt-2">{stats.vendors}</p>
            </div>
            <div className="bg-purple-100/50 p-2 rounded-full">
              <Users className="text-purple-600 h-5 w-5" />
            </div>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={transactionStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {transactionStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-gray-600 text-sm font-medium pb-4">ID</th>
                  <th className="text-left text-gray-600 text-sm font-medium pb-4">ORDER STATUS</th>
                  <th className="text-left text-gray-600 text-sm font-medium pb-4">QUANTITY</th>
                  <th className="text-left text-gray-600 text-sm font-medium pb-4">PRICE</th>
                  <th className="text-left text-gray-600 text-sm font-medium pb-4">DATE</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t border-gray-100">
                    <td className="py-4 text-sm">{transaction.id}</td>
                    <td className="py-4 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(transaction.order_status)}`}>
                        {transaction.order_status}
                      </span>
                    </td>
                    <td className="py-4 text-sm">{transaction.quantity}</td>
                    <td className="py-4 text-sm">
                      ${transaction.price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 text-sm">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;