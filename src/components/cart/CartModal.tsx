/**
 * CartModal Component
 * 
 * This component displays the shopping cart as a modal overlay.
 * It shows a list of cart items and a summary section at the bottom.
 * 
 * Features:
 * - Uses reusable Modal component for consistent styling
 * - Displays empty cart message when no items
 * - Shows scrollable list of cart items
 * - Includes cart summary with total and checkout button
 * - Handles item removal from cart
 */

import { Product } from '../../types';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import Modal from '../common/Modal';

interface CartModalProps {
  isOpen: boolean;           // Controls modal visibility
  onClose: () => void;       // Callback when modal is closed
  products: Product[];       // Array of products in cart
  onRemoveItem: (productId: number) => void;  // Callback to remove item from cart
  total: number;             // Total price of items in cart
}

// Main cart modal component
export default function CartModal({
  isOpen,
  onClose,
  products,
  onRemoveItem,
  total
}: CartModalProps) {
  return (
    // Use reusable Modal component for consistent styling
    <Modal isOpen={isOpen} onClose={onClose} title="Shopping Cart">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Show message if cart is empty */}
        {products.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty</p>
        ) : (
          // List of cart items with spacing between them
          <div className="space-y-4">
            {products.map((product) => (
              <CartItem
                key={product.id}
                product={product}
                onRemove={onRemoveItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cart summary section at bottom */}
      <CartSummary
        total={total}
        onCheckout={() => alert('Checkout functionality coming soon!')}
        disabled={products.length === 0}
      />
    </Modal>
  );
} 