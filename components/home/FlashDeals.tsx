'use client';

import React, { useRef, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaFire } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ProductCard from '../ui/ProductCard';
import './FlashDeals.css';

export const FlashDeals: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const products = [
    {
      id: 1,
      image: '/images/product-1.svg',
      category: 'Electronics',
      name: 'Premium Wireless Headphones',
      price: 79.99,
      originalPrice: 129.99,
      rating: 4.8,
      reviews: 245,
      discount: 38,
    },
    {
      id: 2,
      image: '/images/product-2.svg',
      category: 'Electronics',
      name: 'Compact Earbuds Pro',
      price: 59.99,
      originalPrice: 99.99,
      rating: 4.6,
      reviews: 189,
      discount: 40,
    },
    {
      id: 3,
      image: '/images/product-3.svg',
      category: 'Electronics',
      name: 'Smart Speaker Plus',
      price: 89.99,
      originalPrice: 149.99,
      rating: 4.7,
      reviews: 312,
      discount: 40,
    },
    {
      id: 4,
      image: '/images/product-4.svg',
      category: 'Electronics',
      name: 'Wireless Charging Pad',
      price: 34.99,
      originalPrice: 59.99,
      rating: 4.5,
      reviews: 156,
      discount: 42,
    },
    {
      id: 5,
      image: '/images/product-1.svg',
      category: 'Electronics',
      name: 'Noise Cancelling Earbuds',
      price: 74.99,
      originalPrice: 119.99,
      rating: 4.9,
      reviews: 423,
      discount: 38,
    },
    {
      id: 6,
      image: '/images/product-2.svg',
      category: 'Electronics',
      name: 'Portable Speaker Lite',
      price: 44.99,
      originalPrice: 79.99,
      rating: 4.4,
      reviews: 267,
      discount: 44,
    },
  ];

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className="flash-deals">
      <div className="container">
        {/* Header */}
        <div className="flash-deals-header">
          <motion.div
            className="flash-deals-title-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flash-deals-badge">
              <FaFire className="badge-icon" />
              <span>Limited Time</span>
            </div>
            <h2 className="flash-deals-title">
              <span className="title-gradient">Flash Deals</span>
            </h2>
            <p className="flash-deals-subtitle">Incredible savings on premium products</p>
          </motion.div>
        </div>

        {/* Products Carousel */}
        <div className="carousel-wrapper">
          {/* Navigation Controls */}
          <div className="carousel-controls">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="scroll-btn scroll-btn-left"
              disabled={!canScrollLeft}
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="scroll-btn scroll-btn-right"
              disabled={!canScrollRight}
            >
              <FaChevronRight />
            </button>
          </div>

          <div className="scroll-container" ref={scrollContainerRef}>
            {products.map((product) => (
              <div key={product.id} className="product-item">
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <motion.button
          className="view-all-btn view-all-btn-bottom"
          whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)' }}
          whileTap={{ scale: 0.95 }}
        >
          View All
        </motion.button>
      </div>
    </section>
  );
};

export default FlashDeals;
