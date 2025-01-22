import pool from '../config/database';
import { Product, Category, Review } from '../types';

export const db = {
  // Product operations
  async getProducts(): Promise<Product[]> {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
    `);
    return result.rows;
  },

  async getProductById(id: number): Promise<Product | null> {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = $1
    `, [id]);
    return result.rows[0] || null;
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const result = await pool.query(`
      INSERT INTO products (
        name, price, description, category_id, image, 
        stock, on_sale, original_price
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *
    `, [
      product.name,
      product.price,
      product.description,
      product.category,
      product.image,
      product.stock,
      product.onSale,
      product.originalPrice
    ]);
    return result.rows[0];
  },

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const fields = Object.keys(product)
      .map((key, i) => `${key} = $${i + 2}`)
      .join(', ');
    const values = Object.values(product);
    
    const result = await pool.query(`
      UPDATE products 
      SET ${fields} 
      WHERE id = $1 
      RETURNING *
    `, [id, ...values]);
    
    return result.rows[0];
  },

  async deleteProduct(id: number): Promise<void> {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
  },

  // Category operations
  async getCategories(): Promise<Category[]> {
    const result = await pool.query('SELECT * FROM categories');
    return result.rows;
  },

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const result = await pool.query(`
      INSERT INTO categories (name, image) 
      VALUES ($1, $2) 
      RETURNING *
    `, [category.name, category.image]);
    return result.rows[0];
  },

  async deleteCategory(id: number): Promise<void> {
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
  },

  // Review operations
  async getProductReviews(productId: number): Promise<Review[]> {
    const result = await pool.query(`
      SELECT r.*, u.name as user_name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.product_id = $1
    `, [productId]);
    return result.rows;
  },

  async createReview(review: Omit<Review, 'id'>): Promise<Review> {
    const result = await pool.query(`
      INSERT INTO reviews (product_id, user_id, rating, comment) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `, [
      review.productId,
      review.userId,
      review.rating,
      review.comment
    ]);
    return result.rows[0];
  }
}; 