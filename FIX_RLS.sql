-- ============================================
-- COMPLETE RLS FIX - RUN THIS IN SUPABASE SQL EDITOR
-- ============================================

-- STEP 1: DISABLE RLS COMPLETELY (DEVELOPMENT MODE)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE flash_deals DISABLE ROW LEVEL SECURITY;
ALTER TABLE explore_sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics DISABLE ROW LEVEL SECURITY;

-- STEP 2: DROP ALL EXISTING POLICIES
DROP POLICY IF EXISTS products_select_policy ON products;
DROP POLICY IF EXISTS products_insert_policy ON products;
DROP POLICY IF EXISTS products_update_policy ON products;
DROP POLICY IF EXISTS products_delete_policy ON products;
DROP POLICY IF EXISTS "products_all" ON products;

DROP POLICY IF EXISTS flash_deals_select_policy ON flash_deals;
DROP POLICY IF EXISTS flash_deals_insert_policy ON flash_deals;
DROP POLICY IF EXISTS flash_deals_update_policy ON flash_deals;
DROP POLICY IF EXISTS flash_deals_delete_policy ON flash_deals;
DROP POLICY IF EXISTS "flash_deals_all" ON flash_deals;

DROP POLICY IF EXISTS explore_sections_select_policy ON explore_sections;
DROP POLICY IF EXISTS explore_sections_insert_policy ON explore_sections;
DROP POLICY IF EXISTS explore_sections_update_policy ON explore_sections;
DROP POLICY IF EXISTS explore_sections_delete_policy ON explore_sections;
DROP POLICY IF EXISTS "explore_sections_all" ON explore_sections;

DROP POLICY IF EXISTS analytics_select_policy ON analytics;
DROP POLICY IF EXISTS analytics_insert_policy ON analytics;
DROP POLICY IF EXISTS analytics_update_policy ON analytics;
DROP POLICY IF EXISTS "analytics_all" ON analytics;

-- STEP 3: VERIFY RLS IS DISABLED
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('products', 'flash_deals', 'explore_sections', 'analytics')
AND schemaname = 'public';

-- ============================================
-- DONE! All RLS is now disabled
-- You can now add/edit/delete products freely
-- ============================================
