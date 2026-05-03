-- ============================================
-- SUPABASE SQL SCHEMA FOR E-COMMERCE APP
-- ============================================
-- Copy and paste this entire script into Supabase SQL Editor

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  discount INTEGER DEFAULT 0 CHECK (discount >= 0 AND discount <= 100),
  rating DECIMAL(3, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reviews INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  is_flash_deal BOOLEAN DEFAULT false,
  image_url TEXT,
  image_path TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. FLASH DEALS TABLE
CREATE TABLE IF NOT EXISTS flash_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  discount_percentage INTEGER NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. EXPLORE NOW SECTIONS TABLE
CREATE TABLE IF NOT EXISTS explore_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  image_url TEXT,
  image_path TEXT,
  is_large BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. ANALYTICS TABLE (for dashboard data)
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  total_sales DECIMAL(12, 2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  total_users INTEGER DEFAULT 0,
  total_products INTEGER DEFAULT 0,
  total_revenue DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date)
);

-- 5. CREATE INDEXES FOR BETTER PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_flash_deal ON products(is_flash_deal);
CREATE INDEX IF NOT EXISTS idx_flash_deals_product_id ON flash_deals(product_id);
CREATE INDEX IF NOT EXISTS idx_flash_deals_active ON flash_deals(is_active);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);

-- 6. ENABLE ROW LEVEL SECURITY (Optional - for future authentication)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE explore_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- 7. CREATE RLS POLICIES FOR PUBLIC ACCESS (Development - for unauthenticated users)
-- Products policies
CREATE POLICY products_select_policy ON products FOR SELECT USING (true);
CREATE POLICY products_insert_policy ON products FOR INSERT WITH CHECK (true);
CREATE POLICY products_update_policy ON products FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY products_delete_policy ON products FOR DELETE USING (true);

-- Flash Deals policies
CREATE POLICY flash_deals_select_policy ON flash_deals FOR SELECT USING (true);
CREATE POLICY flash_deals_insert_policy ON flash_deals FOR INSERT WITH CHECK (true);
CREATE POLICY flash_deals_update_policy ON flash_deals FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY flash_deals_delete_policy ON flash_deals FOR DELETE USING (true);

-- Explore Sections policies
CREATE POLICY explore_sections_select_policy ON explore_sections FOR SELECT USING (true);
CREATE POLICY explore_sections_insert_policy ON explore_sections FOR INSERT WITH CHECK (true);
CREATE POLICY explore_sections_update_policy ON explore_sections FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY explore_sections_delete_policy ON explore_sections FOR DELETE USING (true);

-- Analytics policies
CREATE POLICY analytics_select_policy ON analytics FOR SELECT USING (true);
CREATE POLICY analytics_insert_policy ON analytics FOR INSERT WITH CHECK (true);
CREATE POLICY analytics_update_policy ON analytics FOR UPDATE USING (true) WITH CHECK (true);
-- In Supabase Dashboard > Storage > Create new bucket
-- Bucket name: products
-- Bucket name: explore-sections

-- 8. SAMPLE DATA (Optional - for testing)
INSERT INTO products (name, description, price, category, discount, rating, reviews, in_stock, is_flash_deal, image_url)
VALUES 
  ('Premium Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 129.99, 'Electronics', 38, 4.8, 245, true, true, '/images/product-1.svg'),
  ('Compact Earbuds Pro', 'Compact earbuds with extended battery life', 70.99, 'Electronics', 32, 4.5, 189, true, false, '/images/product-2.svg'),
  ('The Great Gatsby', 'Classic literature book', 18.99, 'Books', 32, 4.8, 512, true, true, '/images/product-1.svg');

INSERT INTO analytics (date, total_sales, total_orders, total_users, total_products, total_revenue)
VALUES 
  (CURRENT_DATE, 5400.00, 42, 328, 45, 12500.00),
  (CURRENT_DATE - INTERVAL '1 day', 4800.00, 38, 315, 45, 11200.00),
  (CURRENT_DATE - INTERVAL '2 days', 6200.00, 51, 302, 45, 14300.00);
