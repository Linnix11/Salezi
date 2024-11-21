import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const AddStockModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    type: 'Electronics',
    price: '',
    stock: '',
    description: ''
  });

  const addStockMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('http://localhost:1337/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ data })
      });
      if (!response.ok) throw new Error('Failed to add product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Produit ajouté avec succès');
      onClose();
    },
    onError: () => {
      toast.error('Erreur lors de l\'ajout du produit');
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Ajouter un article</h2>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          addStockMutation.mutate(formData);
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Electronics">Electronics</option>
              <option value="Books">Books</option>
              <option value="CDs">CDs</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Prix</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              disabled={addStockMutation.isLoading}
            >
              {addStockMutation.isLoading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};