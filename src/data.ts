import { Product, Category, Review } from './types';

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 249.99,
    originalPrice: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    description: "High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Features include touch controls, voice assistant support, and multipoint pairing.",
    rating: 4.8,
    reviews: [], // Reviews will be fetched from the database
    stock: 15,
    onSale: true,
    relatedProducts: [4, 2]
  },
  {
    id: 2,
    name: "Minimalist Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    description: "Elegant minimalist watch with genuine leather strap, sapphire crystal glass, and Japanese quartz movement. Water-resistant up to 30 meters.",
    rating: 4.5,
    reviews: [], // Reviews will be fetched from the database
    stock: 8,
    onSale: false,
    relatedProducts: [3]
  },
  // Add other products similarly
];

export const categories: Category[] = [
  {
    id: 1,
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Bags",
    image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80"
  }
];

export const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A-Z', value: 'name-asc' },
  { label: 'Name: Z-A', value: 'name-desc' },
  { label: 'Rating: High to Low', value: 'rating-desc' }
];