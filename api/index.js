import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import midtransClient from 'midtrans-client';

dotenv.config();

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY
});

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err) => {
  if (err) {
    console.error('Failed to connect to the database:', err.message);
  } else {
    console.log('Connected to PostgreSQL successfully');
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    
    if (lat && lng && radius) {
      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);
      const parsedRadius = parseFloat(radius);
      
      const query = `
        SELECT *, (
          6371 * acos(
            cos(radians($1)) * cos(radians(latitude)) *
            cos(radians(longitude) - radians($2)) +
            sin(radians($1)) * sin(radians(latitude))
          )
        ) AS distance
        FROM products
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
        AND (
          6371 * acos(
            cos(radians($1)) * cos(radians(latitude)) *
            cos(radians(longitude) - radians($2)) +
            sin(radians($1)) * sin(radians(latitude))
          )
        ) <= $3
        ORDER BY distance ASC
      `;
      const result = await pool.query(query, [parsedLat, parsedLng, parsedRadius]);
      res.json(result.rows);
    } else {
      const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
      res.json(result.rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, category, price, condition, description, ai_verified, sold, seller, image_url, latitude, longitude } = req.body;
    
    const result = await pool.query(
      `INSERT INTO products (name, category, price, condition, description, ai_verified, sold, seller, image_url, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [name, category, price, condition, description, ai_verified, sold, seller, image_url, latitude || null, longitude || null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/products/:id/sold', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('UPDATE products SET sold = true WHERE id = $1 RETURNING *', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/payment/token', async (req, res) => {
  try {
    const { id, name, price } = req.body;
    const parsedPrice = parseInt(price.replace(/[^0-9]/g, ''), 10) || 0;
    
    let parameter = {
      "transaction_details": {
        "order_id": "EVOLVE-" + id + "-" + Date.now(),
        "gross_amount": parsedPrice
      },
      "credit_card": {
        "secure": true
      },
      "customer_details": {
        "first_name": "E-Volve",
        "last_name": "User",
        "email": "user@e-volve.com",
        "phone": "08111222333"
      },
      "item_details": [{
        "id": String(id),
        "price": parsedPrice,
        "quantity": 1,
        "name": name.substring(0, 50)
      }]
    };

    const transaction = await snap.createTransaction(parameter);
    res.json({ token: transaction.token });
  } catch (err) {
    console.error("Midtrans Error:", err);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
  });
}

export default app;
