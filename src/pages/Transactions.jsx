import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

export const Transactions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: transactionApi.getAll
  });

  const approveMutation = useMutation({
    mutationFn: transactionApi.approve,
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      toast.success('Transaction approved');
    },
    onError: () => {
      toast.error('Failed to approve transaction');
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions</h1>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              {(user?.role === 'super-admin' || user?.role === 'manager') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions?.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  #{transaction.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.product?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  €{transaction.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    transaction.status === 'approved' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </td>
                {(user?.role === 'super-admin' || user?.role === 'manager') && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.status === 'pending' && (
                      <button
                        onClick={() => approveMutation.mutate(transaction.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};