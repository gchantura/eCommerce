import { Product, Category, Review } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  // Product operations
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  async getProductById(id: number): Promise<Product | null> {
    const response = await fetch(`${API_URL}/products/${id}`);
    return response.json();
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    return response.json();
  },

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(id: number): Promise<void> {
    await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Category operations
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_URL}/categories`);
    return response.json();
  },

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });
    return response.json();
  },

  async deleteCategory(id: number): Promise<void> {
    await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // Review operations
  async getProductReviews(productId: number): Promise<Review[]> {
    const response = await fetch(`${API_URL}/products/${productId}/reviews`);
    return response.json();
  },

  async createReview(review: Omit<Review, 'id'>): Promise<Review> {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
    });
    return response.json();
  },

  async deleteImage(imageUrl: string): Promise<void> {
    await fetch(`${API_URL}/images`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });
  },
}; 