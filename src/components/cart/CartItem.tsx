/**
 * CartItem Component
 * 
 * This component displays a single item in the shopping cart.
 * It shows the product image, name, category, price, and a remove button.
 * 
 * Features:
 * - Displays product information in a compact format
 * - Provides a remove button to delete items from cart
 * - Responsive design with consistent spacing
 * - Price formatting with 2 decimal places
 */

import { X } from 'lucide-react';
import { Product } from '../../types';

interface CartItemProps {
  product: Product;          // Product to display in cart
  onRemove: (productId: number) => void;  // Callback when item is removed
}

// Individual cart item component
export default function CartItem({ product, onRemove }: CartItemProps) {
  return (
    // Container with flex layout for horizontal alignment
    <div className="flex items-center space-x-4">
      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-16 h-16 object-cover rounded"
      />

      {/* Product Details Container */}
      <div className="flex-1">
        {/* Product Name */}
        <h3 className="font-medium">{product.name}</h3>
        {/* Product Category */}
        <p className="text-sm text-gray-500">{product.category}</p>
        {/* Product Price */}
        <p className="text-sm font-semibold">${product.price.toFixed(2)}</p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(product.id)}
        className="p-1 hover:bg-gray-100 rounded-full"
        aria-label={`Remove ${product.name} from cart`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
} 