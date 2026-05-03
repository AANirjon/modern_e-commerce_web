'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import './SearchBar.css';

interface Category {
  value: string;
  label: string;
}

export const SearchBar: React.FC<{ onCategoryChange?: (category: string) => void }> = ({ onCategoryChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch unique categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('category')
          .eq('in_stock', true);

        if (error) throw error;

        // Get unique categories
        const uniqueCategories = Array.from(
          new Map(
            (data || [])
              .map((p: { category: string }) => ([
                p.category,
                { value: p.category.toLowerCase(), label: p.category }
              ]))
          ).values()
        );

        // Add "All Categories" at the beginning
        const allCategories: Category[] = [
          { value: 'all', label: 'All Categories' },
          ...uniqueCategories
        ];

        setCategories(allCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback categories
        setCategories([{ value: 'all', label: 'All Categories' }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Navigate to products page with search query and category
    const queryParams = new URLSearchParams();
    queryParams.set('search', searchQuery);
    if (selectedCategory !== 'all') {
      queryParams.set('category', selectedCategory);
    }

    router.push(`/products?${queryParams.toString()}`);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    onCategoryChange?.(newCategory);
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <div className="container">
        <div className="search-content">
          {/* Categories Dropdown */}
          <div className="search-category">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              aria-label="Select product category"
              className="category-select"
              disabled={isLoading}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Searching for..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search products"
            className="search-input"
          />

          {/* Search Button */}
          <button type="submit" aria-label="Search" className="search-btn">
            <FaSearch />
            <span className="search-btn-text">Search</span>
          </button>
        </div>

        {/* Search Suggestions */}
        {searchQuery && (
          <div className="search-suggestions">
            Showing results for: <span className="search-term">{searchQuery}</span>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
