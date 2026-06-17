ALTER TABLE products ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,8);
ALTER TABLE products ADD COLUMN IF NOT EXISTS longitude DECIMAL(11,8);

UPDATE products SET latitude = -6.200000, longitude = 106.816666 WHERE id = 1;
UPDATE products SET latitude = -6.250000, longitude = 106.800000 WHERE id = 2;
UPDATE products SET latitude = -6.150000, longitude = 106.900000 WHERE id = 3;
UPDATE products SET latitude = -6.210000, longitude = 106.750000 WHERE id = 4;
