CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price VARCHAR(50) NOT NULL,
  condition VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  ai_verified BOOLEAN DEFAULT false,
  sold BOOLEAN DEFAULT false,
  seller VARCHAR(100) NOT NULL,
  image_url TEXT
);

TRUNCATE TABLE products RESTART IDENTITY CASCADE;

INSERT INTO products (name, category, price, condition, description, ai_verified, sold, seller, image_url) VALUES 
('Samsung 16GB DDR4 3200MHz SODIMM', 'RAM', 'Rp 450.000', '98% Normal', 'Copotan laptop gaming Asus ROG. Pin mulus, lolos stress test AI.', true, false, 'TechnoJunkie_99', '/assets/components/ram.png'),
('WD Blue SN550 500GB NVMe SSD', 'Storage', 'Rp 550.000', 'Health 95%', 'Health status terbaca 95% via CrystalDiskInfo. Suhu normal.', true, false, 'EcoStore.id', '/assets/components/ssd.png'),
('Panel Layar BOE 14.0" FHD IPS 60Hz', 'Display', 'Rp 850.000', 'Tanpa Dead Pixel', 'Layar mulus tanpa cacat fisik. Copotan Lenovo Thinkpad.', true, false, 'PartLestari', '/assets/components/display.png'),
('Intel Dual Band Wireless-AC 8265', 'Network', 'Rp 120.000', 'Normal', 'Kartu WiFi copotan. Sinyal stabil, mendukung frekuensi 5GHz.', true, false, 'AlexRepair', '/assets/components/wifi.png');
