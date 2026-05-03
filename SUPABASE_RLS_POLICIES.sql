-- ============================================
-- SUPABASE RLS POLICIES FOR E-COMMERCE APP
-- ============================================
-- Run this script in Supabase SQL Editor to add RLS policies
-- This allows public/unauthenticated access for development

-- 1. PRODUCTS TABLE POLICIES
DROP POLICY IF EXISTS products_select_policy ON products;
DROP POLICY IF EXISTS products_insert_policy ON products;
DROP POLICY IF EXISTS products_update_policy ON products;
DROP POLICY IF EXISTS products_delete_policy ON products;

CREATE POLICY products_select_policy ON products FOR SELECT USING (true);
CREATE POLICY products_insert_policy ON products FOR INSERT WITH CHECK (true);
CREATE POLICY products_update_policy ON products FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY products_delete_policy ON products FOR DELETE USING (true);

-- 2. FLASH DEALS TABLE POLICIES
DROP POLICY IF EXISTS flash_deals_select_policy ON flash_deals;
DROP POLICY IF EXISTS flash_deals_insert_policy ON flash_deals;
DROP POLICY IF EXISTS flash_deals_update_policy ON flash_deals;
DROP POLICY IF EXISTS flash_deals_delete_policy ON flash_deals;

CREATE POLICY flash_deals_select_policy ON flash_deals FOR SELECT USING (true);
CREATE POLICY flash_deals_insert_policy ON flash_deals FOR INSERT WITH CHECK (true);
CREATE POLICY flash_deals_update_policy ON flash_deals FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY flash_deals_delete_policy ON flash_deals FOR DELETE USING (true);

-- 3. EXPLORE SECTIONS TABLE POLICIES
DROP POLICY IF EXISTS explore_sections_select_policy ON explore_sections;
DROP POLICY IF EXISTS explore_sections_insert_policy ON explore_sections;
DROP POLICY IF EXISTS explore_sections_update_policy ON explore_sections;
DROP POLICY IF EXISTS explore_sections_delete_policy ON explore_sections;

CREATE POLICY explore_sections_select_policy ON explore_sections FOR SELECT USING (true);
CREATE POLICY explore_sections_insert_policy ON explore_sections FOR INSERT WITH CHECK (true);
CREATE POLICY explore_sections_update_policy ON explore_sections FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY explore_sections_delete_policy ON explore_sections FOR DELETE USING (true);

-- 4. ANALYTICS TABLE POLICIES
DROP POLICY IF EXISTS analytics_select_policy ON analytics;
DROP POLICY IF EXISTS analytics_insert_policy ON analytics;
DROP POLICY IF EXISTS analytics_update_policy ON analytics;

CREATE POLICY analytics_select_policy ON analytics FOR SELECT USING (true);
CREATE POLICY analytics_insert_policy ON analytics FOR INSERT WITH CHECK (true);
CREATE POLICY analytics_update_policy ON analytics FOR UPDATE USING (true) WITH CHECK (true);

-- ============================================
-- DONE! RLS policies are now configured for public access
-- ============================================
