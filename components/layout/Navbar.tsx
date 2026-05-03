'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaUser, FaShoppingCart, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { Badge } from '@mui/material';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const cartCount = 3;

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Books',
  ];

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'User Account', href: '#' },
  ];

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <span className="logo-text">Brand Name</span>
        </Link>

        {/* Desktop Menu Items */}
        <div className="navbar-menu">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.href} className="menu-item">
              {item.label}
            </Link>
          ))}

          {/* Categories Dropdown */}
          <div
            className="category-dropdown"
            onMouseEnter={() => setIsCategoryDropdownOpen(true)}
            onMouseLeave={() => setIsCategoryDropdownOpen(false)}
          >
            <button className="menu-item category-toggle">
              Categories
              <FaChevronDown className={`dropdown-icon ${isCategoryDropdownOpen ? 'open' : ''}`} />
            </button>

            {isCategoryDropdownOpen && (
              <div className="dropdown-menu">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/products/${encodeURIComponent(category)}`}
                    className="dropdown-item"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="navbar-icons">
          {/* Profile Icon */}
          <button
            aria-label="User profile"
            className="icon-btn"
            title="User profile"
          >
            <FaUser />
          </button>

          {/* Cart Icon with Badge */}
          <button
            aria-label={`Shopping cart with ${cartCount} items`}
            className="icon-btn"
            title="Shopping cart"
          >
            <Badge badgeContent={cartCount} color="error">
              <FaShoppingCart />
            </Badge>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="mobile-menu-item"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
