/**
 * TableBody Component
 * 
 * Renders the main content of the product table.
 * Maps through products and renders individual rows.
 * 
 * Features:
 * - Handles mapping of products to table rows
 * - Maintains consistent styling between rows
 * - Passes necessary callbacks to row components
 */

import { Product } from '../../types';
import ProductTableRow from './ProductTableRow';

interface TableBodyProps {
  products: Product[];
  onDelete: (id: number) => void;
  onEdit: (product: Product) => void;
}

export default function TableBody({ products, onDelete, onEdit }: TableBodyProps) {
  if (!Array.isArray(products)) {
    console.error('Products is not an array:', products);
    return null;
  }

  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {products.map((product) => (
        <ProductTableRow
          key={product.id.toString()}
          product={product}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </tbody>
  );
} 