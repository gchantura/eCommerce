export interface Product {
  id: number;
  name: string;
  price: number | string;
  description: string;
  category: string;
  image: string;
  stock: number;
  rating: number;
  reviews: Review[];
  onSale: boolean;
  originalPrice?: number | string | null;
  created_at?: string;
  relatedProducts: number[];
}

export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SortOption {
  label: string;
  value: string;
}

export interface FilterState {
  sortBy: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  onSale: boolean;
  inStock: boolean;
}

export interface WishlistItem {
  productId: number;
  dateAdded: string;
}