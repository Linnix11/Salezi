import React, { useEffect, useState } from 'react';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/products');
        const result = await response.json();
        
        if (result.data && Array.isArray(result.data)) {
          setProducts(result.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    return (price / 100).toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Products</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg p-6">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-gray-600 text-sm font-medium pb-4">ID</th>
              <th className="text-left text-gray-600 text-sm font-medium pb-4">TITLE</th>
              <th className="text-left text-gray-600 text-sm font-medium pb-4">TYPE</th>
              <th className="text-left text-gray-600 text-sm font-medium pb-4">PRICE</th>
              <th className="text-left text-gray-600 text-sm font-medium pb-4">STOCK</th>
              <th className="text-left text-gray-600 text-sm font-medium pb-4">STATUS</th>
              <th className="text-left text-gray-600 text-sm font-medium pb-4">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-gray-100">
                <td className="py-4 text-sm">{product.id}</td>
                <td className="py-4">
                  <div>
                    <p className="text-gray-00">{product.title}</p>
                    <p className="text-gray-500 text-sm">{product.description}</p>
                  </div>
                </td>
                <td className="py-4">
                  <span className="px-2 py-1 text-sm rounded-md bg-gray-100">
                    {product.type}
                  </span>
                </td>
                <td className="py-4 text-sm">{formatPrice(product.price)}</td>
                <td className="py-4">
                  <span className="text-green-600">{product.stock}</span>
                </td>
                <td className="py-4">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Published
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex gap-3">
                    <button className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;