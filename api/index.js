import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import midtransClient from 'midtrans-client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'evolve_secret_key_123';
const googleClient = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id');

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY
});

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Failed to connect to the database:', err.message);
  } else {
    console.log('Connected to PostgreSQL successfully');
    client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        auth_provider VARCHAR(50) DEFAULT 'local',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `).then(() => console.log('users table ensured')).catch(console.error).finally(() => release());
  }
});

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    
    // Check existing user
    const exist = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exist.rows.length > 0) {
      return res.status(400).json({ error: 'Email sudah terdaftar.' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    const result = await pool.query(
      'INSERT INTO users (full_name, email, password_hash, auth_provider) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email',
      [full_name, email, password_hash, 'local']
    );
    
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user) {
      return res.status(400).json({ error: 'Kredensial tidak valid.' });
    }
    
    if (user.auth_provider !== 'local') {
      return res.status(400).json({ error: `Akun ini terdaftar dengan ${user.auth_provider}. Gunakan metode tersebut untuk login.` });
    }
    
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Kredensial tidak valid.' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { id: user.id, full_name: user.full_name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id'
    });
    
    const payload = ticket.getPayload();
    const email = payload.email;
    const full_name = payload.name;
    
    // Check if user exists
    let result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = result.rows[0];
    
    if (!user) {
      // Create user if not exists
      const insertResult = await pool.query(
        'INSERT INTO users (full_name, email, password_hash, auth_provider) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email',
        [full_name, email, null, 'google']
      );
      user = insertResult.rows[0];
    }
    
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { id: user.id, full_name: user.full_name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Google Auth Error' });
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
