/**
 * ProductTableRow Component
 * 
 * This component represents a single row in the product management table.
 * It displays product information and provides edit/delete actions.
 * 
 * Features:
 * - Displays product details (ID, image, name, description, etc.)
 * - Provides edit and delete actions for product management
 * - Handles price formatting and sale price display
 * - Responsive table row design with consistent styling
 */

import { Product } from '../../types';
import { Trash2, Edit } from 'lucide-react';

interface ProductTableRowProps {
  product: Product;
  onDelete: (id: number) => void;
  onEdit: (product: Product) => void;
}

export default function ProductTableRow({ product, onDelete, onEdit }: ProductTableRowProps) {
  if (!product) return null;  // Add this guard clause

  // Convert price to number and handle formatting
  const formatPrice = (price: number | string | null | undefined) => {
    if (price === null || price === undefined) return '0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toFixed(2);
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {product.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <img 
              className="h-10 w-10 rounded-full object-cover" 
              src={product.image} 
              alt={product.name}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {product.name}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {product.category}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${formatPrice(product.price)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {product.stock}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          product.onSale ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {product.onSale ? 'On Sale' : 'Regular Price'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onEdit(product)}
          className="text-indigo-600 hover:text-indigo-900 mr-4"
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="text-red-600 hover:text-red-900"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
} 