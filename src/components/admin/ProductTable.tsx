/**
 * ProductTable Component
 * 
 * Main component for displaying the product management table.
 * Combines TableHeader and TableBody components for better organization.
 * 
 * Features:
 * - Responsive table layout with horizontal scroll
 * - Organized table structure with header and body components
 * - Consistent styling and spacing
 * - Clear visual hierarchy with title and table content
 */

import { Product } from '../../types';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

interface ProductTableProps {
  products: Product[];         // Array of products to display
  onEdit: (product: Product) => void;    // Callback for edit action
  onDelete: (product: Product) => void;  // Callback for delete action
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="mb-8 overflow-x-auto">
      {/* Table Title */}
      <h2 className="text-xl font-semibold mb-4">Product Management</h2>
      
      {/* Main Table Container */}
      <table className="min-w-full divide-y divide-gray-200">
        <TableHeader />
        <TableBody 
          products={products}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </table>
    </div>
  );
} 