import express, { Request, Response, Application, RequestHandler } from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

dotenv.config();

const app: Application = express();
const port = 3000;

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.connect()
  .then(client => {
    console.log('Successfully connected to database');
    client.release();
  })
  .catch(err => {
    console.error('Error connecting to database:', err);
  });

interface TypedRequest<T> extends Express.Request {
  body: T;
}

interface TypedRequestParams<P extends ParamsDictionary> extends Express.Request {
  params: P;
}

// Product routes
app.get('/api/products', (async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.name,
        CAST(p.price AS FLOAT) as price,
        p.description,
        p.category_id,
        c.name as category,
        p.image,
        p.stock,
        COALESCE(p.rating, 0) as rating,
        p.on_sale as "onSale",
        CAST(p.original_price AS FLOAT) as "originalPrice",
        p.created_at,
        COALESCE(
          (SELECT json_agg(
            json_build_object(
              'id', r.id,
              'rating', r.rating,
              'comment', r.comment,
              'userId', r.user_id,
              'created_at', r.created_at
            )
          )
          FROM reviews r
          WHERE r.product_id = p.id
        ), '[]') as reviews
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
    `);

    const products = result.rows.map(product => ({
      ...product,
      price: parseFloat(product.price) || 0,
      originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
      reviews: product.reviews || []
    }));

    console.log('Products fetched:', products);
    res.json(products);
  } catch (err: any) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: err.message });
  }
}) as RequestHandler);

app.post('/api/products', (async (req: Request, res: Response) => {
  try {
    const { name, price, description, category, image, stock, onSale, originalPrice } = req.body;
    const result = await pool.query(`
      INSERT INTO products (name, price, description, category_id, image, stock, on_sale, original_price)
      VALUES ($1, $2, $3, (SELECT id FROM categories WHERE name = $4), $5, $6, $7, $8)
      RETURNING *
    `, [name, price, description, category, image, stock, onSale, originalPrice]);
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}) as RequestHandler);

app.put('/api/products/:id', (async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, description, category, image, stock, onSale, originalPrice } = req.body as {
      name: string;
      price: number;
      description: string;
      category: string;
      image: string;
      stock: number;
      onSale: boolean;
      originalPrice: number;
    };
    
    const categoryResult = await pool.query(
      'SELECT id FROM categories WHERE name = $1',
      [category]
    );
    
    if (!categoryResult.rows[0]) {
      return res.status(400).json({ error: 'Category not found' });
    }
    
    const categoryId = categoryResult.rows[0].id;
    
    const result = await pool.query(`
      UPDATE products 
      SET 
        name = $1,
        price = $2,
        description = $3,
        category_id = $4,
        image = $5,
        stock = $6,
        on_sale = $7,
        original_price = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *,
        (SELECT name FROM categories WHERE id = category_id) as category
    `, [
      name,
      price,
      description,
      categoryId,
      image,
      stock,
      onSale,
      originalPrice,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log('Product updated:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: err.message });
  }
}) as RequestHandler);

// Category routes
app.get('/api/categories', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    console.log('Categories fetched:', result.rows);
    res.json(result.rows || []);  // Return empty array if no results
  } catch (err: any) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', (async (req: Request, res: Response) => {
  try {
    const { name, image } = req.body;
    // First check if category already exists
    const existingCategory = await pool.query(
      'SELECT * FROM categories WHERE name = $1',
      [name]
    );
    
    if (existingCategory.rows.length > 0) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const result = await pool.query(`
      INSERT INTO categories (name, image)
      VALUES ($1, $2)
      RETURNING *
    `, [name, image]);

    console.log('Category created:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('Error creating category:', err);
    res.status(500).json({ error: err.message });
  }
}) as RequestHandler);

app.delete('/api/categories/:id', async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM categories WHERE id = $1', [req.params.id]);
    res.status(200).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.status(200).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/images', async (req: Request, res: Response) => {
  try {
    const { imageUrl } = req.body;
    // Add your image deletion logic here
    res.status(200).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 