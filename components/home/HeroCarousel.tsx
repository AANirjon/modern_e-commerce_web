'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './HeroCarousel.css';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  backgroundImage: string;
  backgroundImageUrl: string;
  cta: string;
}

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev

  const slides: HeroSlide[] = [
    {
      id: 1,
      title: '50% Off For Your First Shopping',
      subtitle: 'Get Free Shipping on all orders over $99.00',
      backgroundImageUrl: '/images/hero-backpack.svg',
      backgroundImage: 'linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%)',
      cta: 'Shop Now',
    },
    {
      id: 2,
      title: 'Premium Quality Products',
      subtitle: 'Discover our exclusive collection with amazing deals',
      backgroundImageUrl: '/images/product-1.svg',
      backgroundImage: 'linear-gradient(135deg, rgba(240, 147, 251, 0.85) 0%, rgba(245, 87, 108, 0.85) 100%)',
      cta: 'Explore',
    },
    {
      id: 3,
      title: 'Free Shipping Worldwide',
      subtitle: 'On all orders over $99. No hidden charges',
      backgroundImageUrl: '/images/product-2.svg',
      backgroundImage: 'linear-gradient(135deg, rgba(79, 172, 254, 0.85) 0%, rgba(0, 242, 254, 0.85) 100%)',
      cta: 'Get Started',
    },
  ];

  useEffect(() => {
    if (!autoPlay || isHovering) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay, isHovering, slides.length]);

  const handlePrevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const handleNextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  const contentVariants = {
    enter: () => ({
      y: 40,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
      transition: { delay: 0.2, duration: 0.6 },
    },
    exit: {
      y: -40,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const slide = slides[currentSlide];

  return (
    <div
      className="hero-carousel-container"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="hero-slide"
          style={{
            background: `${slide.backgroundImage}, url('${slide.backgroundImageUrl}') center/cover no-repeat`,
            backgroundBlendMode: 'overlay',
          }}
        >
          {/* Dark overlay for readability */}
          <div className="hero-overlay"></div>

          {/* Gradient overlay (subtle left to right) */}
          <div className="hero-gradient-overlay"></div>

          {/* Centered content */}
          <AnimatePresence>
            <motion.div
              key={`content-${currentSlide}`}
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="hero-content-center"
            >
              <div className="hero-content-inner">
                <motion.h1
                  className="hero-title"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {slide.title}
                </motion.h1>

                <motion.p
                  className="hero-subtitle"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  {slide.subtitle}
                </motion.p>

                <motion.button
                  className="hero-cta-button"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {slide.cta}
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        className="carousel-arrow carousel-arrow-prev"
        onClick={handlePrevSlide}
        aria-label="Previous slide"
      >
        &#10094;
      </button>
      <button
        className="carousel-arrow carousel-arrow-next"
        onClick={handleNextSlide}
        aria-label="Next slide"
      >
        &#10095;
      </button>

      {/* Navigation Dots */}
      <div className="carousel-dots-container">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            layout
            layoutId={index === currentSlide ? 'active-dot' : undefined}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
