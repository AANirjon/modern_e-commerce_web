'use client';

import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

export const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports' },
    { value: 'books', label: 'Books' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery, 'Category:', selectedCategory);
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <div className="container">
        <div className="search-content">
          {/* Categories Dropdown */}
          <div className="search-category">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Select product category"
              className="category-select"
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
