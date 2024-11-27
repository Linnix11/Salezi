import React, { useEffect, useState } from 'react';
import { Mail, DollarSign, Users } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 4,
    sales: 2,
    vendors: 3
  });
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/transactions');
        const result = await response.json();
        
        if (result.data && Array.isArray(result.data)) {
          const formattedTransactions = result.data.map(t => ({
            id: t.id,
            documentId: t.documentId,
            orderStatus: t.order_status,
            quantity: t.quantity,
            price: t.total_price,
            date: new Date(t.date).toLocaleDateString('fr-FR')
          }));
          
          setRecentTransactions(formattedTransactions);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

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
              <h3 className="text-green-600 text-sm">Total Sales</h3>
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

      {/* Sales Overview & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
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
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        transaction.orderStatus === 'validated' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.orderStatus}
                      </span>
                    </td>
                    <td className="py-4 text-sm">{transaction.quantity}</td>
                    <td className="py-4 text-sm">${transaction.price}</td>
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