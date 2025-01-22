/**
 * CartSummary Component
 * 
 * This component displays the cart total and checkout button.
 * It appears at the bottom of the cart modal.
 * 
 * Features:
 * - Shows total price with proper formatting
 * - Provides checkout button that can be disabled
 * - Uses reusable Button component
 * - Clear visual separation with border
 */

import Button from '../common/Button';

interface CartSummaryProps {
  total: number;            // Total price of items in cart
  onCheckout: () => void;   // Callback for checkout action
  disabled: boolean;        // Whether checkout is disabled
}

// Cart summary component showing total and checkout button
export default function CartSummary({ total, onCheckout, disabled }: CartSummaryProps) {
  return (
    // Container with top border for visual separation
    <div className="border-t p-4">
      {/* Total Price Display */}
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold">Total:</span>
        <span className="text-lg font-bold">${total.toFixed(2)}</span>
      </div>

      {/* Checkout Button */}
      <Button
        onClick={onCheckout}
        disabled={disabled}
        fullWidth
      >
        Checkout
      </Button>
    </div>
  );
} 