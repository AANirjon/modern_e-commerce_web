'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import './HeroCarousel.css';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
}

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const slides: HeroSlide[] = [
    {
      id: 1,
      title: '50% Off For Your First Shopping',
      subtitle: 'Get Free Shipping on all orders over $99.00',
      image: '/images/hero-backpack.svg',
      cta: 'Shop Now',
    },
    {
      id: 2,
      title: 'Premium Quality Products',
      subtitle: 'Discover our exclusive collection with amazing deals',
      image: '/images/hero-backpack.svg',
      cta: 'Explore',
    },
    {
      id: 3,
      title: 'Free Shipping Worldwide',
      subtitle: 'On all orders over $99. No hidden charges',
      image: '/images/hero-backpack.svg',
      cta: 'Get Started',
    },
  ];

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const slide = slides[currentSlide];

  return (
    <div className="hero-carousel">
      <div className="container hero-content">
        {/* Left: Content */}
        <div className="hero-left">
          <div className="hero-text">
            <h1 className="hero-title">{slide.title}</h1>
            <p className="hero-subtitle">{slide.subtitle}</p>
          </div>

          <button className="hero-btn">{slide.cta}</button>

          {/* Features */}
          <div className="hero-features">
            <p className="hero-feature">
              <span className="checkmark">✓</span>
              Free shipping on orders over $99
            </p>
            <p className="hero-feature">
              <span className="checkmark">✓</span>
              30-day money-back guarantee
            </p>
            <p className="hero-feature">
              <span className="checkmark">✓</span>
              24/7 customer support
            </p>
          </div>
        </div>

        {/* Right: Image */}
        <div className="hero-right">
          <div className="hero-image-container">
            <div className="hero-decoration"></div>
            <Image
              src={slide.image}
              alt={slide.title}
              width={400}
              height={400}
              className="hero-image"
              priority
            />
          </div>
        </div>
      </div>

      {/* Carousel Dots */}
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <p className="slide-counter">
        {currentSlide + 1} / {slides.length}
      </p>
    </div>
  );
};

export default HeroCarousel;
