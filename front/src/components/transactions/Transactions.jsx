import React, { useEffect, useState } from 'react';
import { Mail, DollarSign, Users } from 'lucide-react';

const Transactions = () => {
  const [stats, setStats] = useState({
    products: 0,
    sales: 0,
    vendors: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsRes = await fetch('http://localhost:1337/api/transactions');
        console.log('Transaction response:', await transactionsRes.clone().json());

        const [productsRes, transactions, vendorsRes] = await Promise.all([
          fetch('http://localhost:1337/api/products'),
          transactionsRes.json(),
          fetch('http://localhost:1337/api/vendors')
        ]);

        const products = await productsRes.json();
        const vendors = await vendorsRes.json();

        setStats({
          products: products.data?.length || 0,
          sales: transactions.data?.length || 0,
          vendors: vendors.data?.length || 0
        });

       
        const formattedTransactions = transactions.data?.map(t => ({
          id: t.id,
          orderStatus: t.order_status,
          quantity: t.quantity,
          date: new Date(t.date).toLocaleDateString(),
          documentId: t.documentId,
          totalPrice: t.total_price
        })) || [];

        console.log('Formatted transactions:', formattedTransactions); 
        setRecentTransactions(formattedTransactions);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* ... Stats cards ... */}
      
      {/* Transactions Table */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-6">Total Transactions</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-gray-600 text-sm font-medium">ID</th>
              <th className="text-left text-gray-600 text-sm font-medium">ORDER STATUS</th>
              <th className="text-left text-gray-600 text-sm font-medium">QUANTITY</th>
              <th className="text-left text-gray-600 text-sm font-medium">PRICE</th>
              <th className="text-left text-gray-600 text-sm font-medium">DATE</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-t border-gray-100">
                  <td className="py-4 text-sm">{transaction.id}</td>
                  <td className="py-4 text-sm">{transaction.orderStatus}</td>
                  <td className="py-4 text-sm">{transaction.quantity}</td>
                  <td className="py-4 text-sm">${transaction.totalPrice}</td>
                  <td className="py-4 text-sm">{transaction.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Transactions;