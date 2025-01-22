import { Product, FilterState } from '../types';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
  filters: FilterState;
  onAddToCart: (productId: number) => void;
  onAddToWishlist?: (productId: number) => void;
}

export default function ProductList({ products, filters, onAddToCart, onAddToWishlist }: ProductListProps) {
  const filteredProducts = products.filter(product => {
    if (filters.minPrice && product.price < filters.minPrice) return false;
    if (filters.maxPrice && product.price > filters.maxPrice) return false;
    if (filters.rating && product.rating < filters.rating) return false;
    if (filters.onSale && !product.onSale) return false;
    if (filters.inStock && product.stock === 0) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'rating-desc':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sortedProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
        />
      ))}
    </div>
  );
}