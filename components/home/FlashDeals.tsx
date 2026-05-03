'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaChevronLeft, FaChevronRight, FaFire } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import ProductCard from '../ui/ProductCard';
import './FlashDeals.css';

interface FlashProduct {
  id: string;
  image_url: string;
  category: string;
  name: string;
  price: number;
  discount: number;
  rating: number;
  reviews: number;
}

export const FlashDeals: React.FC = () => {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [products, setProducts] = useState<FlashProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch flash deals products
  useEffect(() => {
    const fetchFlashDeals = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('flash_deals')
          .select(`
            id,
            discount_percentage,
            products(id, name, price, discount, rating, reviews, image_url, category)
          `)
          .eq('is_active', true)
          .limit(6);

        if (error) throw error;

        // Transform the data to match ProductCard props
        const deals = data as unknown as Array<{
          products?: { id: string; name: string; price: number; rating: number; reviews: number; image_url: string; category: string };
          discount_percentage?: number;
        }>;

        const transformedProducts: FlashProduct[] = deals?.map((deal) => ({
          id: deal.products?.id || '',
          name: deal.products?.name || '',
          price: (deal.products?.price || 0) * (1 - (deal.discount_percentage || 0) / 100),
          rating: deal.products?.rating || 0,
          reviews: deal.products?.reviews || 0,
          image_url: deal.products?.image_url || '',
          category: deal.products?.category || '',
          discount: deal.discount_percentage || 0,
        })) || [];

        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching flash deals:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashDeals();
  }, []);

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
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', width: '100%' }}>
                <p>Loading flash deals...</p>
              </div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="product-item">
                  <ProductCard
                    id={product.id}
                    image={product.image_url || '/placeholder.svg'}
                    category={product.category}
                    name={product.name}
                    price={product.price}
                    rating={product.rating}
                    reviews={product.reviews}
                    discount={product.discount}
                  />
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', width: '100%' }}>
                <p>No active flash deals at the moment</p>
              </div>
            )}
          </div>
        </div>

        {/* View All Button */}
        <motion.button
          className="view-all-btn view-all-btn-bottom"
          onClick={() => router.push('/products')}
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
