import { useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsProps {
  products: Product[];
  onAddToCart: (productId: number) => void;
}

export default function ProductDetails({ products, onAddToCart }: ProductDetailsProps) {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate('/shop')}
            className="text-blue-600 hover:text-blue-800"
          >
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  const reviews = product.reviews || [];
  const rating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const formatPrice = (price: number | string | null | undefined) => {
    if (price === null || price === undefined) return '0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toFixed(2);
  };

  const relatedProducts = products
    .filter(p => 
      p.id !== product.id && 
      p.category === product.category
    )
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-8"
      >
        <ArrowLeft className="mr-2" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
          {/* Add thumbnail gallery here if needed */}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              ({reviews.length} reviews)
            </span>
          </div>

          <div className="mb-6">
            {product.onSale && product.originalPrice ? (
              <div className="flex items-center">
                <span className="text-3xl font-bold text-red-600">
                  ${formatPrice(product.price)}
                </span>
                <span className="ml-2 text-xl text-gray-500 line-through">
                  ${formatPrice(product.originalPrice)}
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                ${formatPrice(product.price)}
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-6">
            <span className="text-gray-700 font-medium">Category: </span>
            <span className="text-gray-600">{product.category}</span>
          </div>

          <div className="mb-6">
            <span className="text-gray-700 font-medium">Availability: </span>
            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product.id)}
            disabled={product.stock === 0}
            className="w-full bg-black text-white py-3 px-6 rounded-lg flex items-center justify-center hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="mr-2" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Add related products cards here */}
          </div>
        </div>
      )}
    </div>
  );
}