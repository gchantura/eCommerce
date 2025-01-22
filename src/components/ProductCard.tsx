import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: number) => void;
  onAddToWishlist?: (productId: number) => void;
}

export default function ProductCard({ product, onAddToCart, onAddToWishlist }: ProductCardProps) {
  const navigate = useNavigate();

  if (!product) return null;

  const reviews = product.reviews || [];
  const rating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const formatPrice = (price: number | string | null | undefined) => {
    if (price === null || price === undefined) return '0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toFixed(2);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div
        className="block relative cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <div className="relative h-64">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.onSale && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
              Sale
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <div
          className="cursor-pointer"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          <h3 className="text-lg font-semibold text-gray-900 hover:text-gray-700">
            {product.name}
          </h3>
        </div>
        <p className="text-gray-500 text-sm mt-1">{product.category}</p>

        <div className="flex items-center mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-1 text-sm text-gray-500">
            ({reviews.length} reviews)
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            {product.onSale && product.originalPrice ? (
              <>
                <span className="text-xl font-bold text-red-600">
                  ${formatPrice(product.price)}
                </span>
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${formatPrice(product.originalPrice)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-900">
                ${formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className="flex space-x-2">
            {onAddToWishlist && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToWishlist(product.id);
                }}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                title="Add to Wishlist"
              >
                <Heart className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product.id);
              }}
              className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={product.stock === 0}
              title={product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}