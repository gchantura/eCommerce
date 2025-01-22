import { X } from 'lucide-react';
import { Product } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRemoveItem: (productId: number) => void;
  total: number;
}

export default function CartModal({ isOpen, onClose, products, onRemoveItem, total }: CartModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {products.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center space-x-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.category}</p>
                      <p className="text-sm font-semibold">${product.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="text-lg font-bold">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => alert('Checkout functionality coming soon!')}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
              disabled={products.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}