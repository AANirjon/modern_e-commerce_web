'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [previousSlide, setPreviousSlide] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [autoPlay, setAutoPlay] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const slides: HeroSlide[] = [
    {
      id: 1,
      title: 'Upgrade your mobile lifestyle',
      subtitle: 'Find premium cases, fast chargers, earbuds and mobile essentials in one curated collection.',
      backgroundImageUrl: 'https://i.ibb.co.com/VsVbgwS/product-1.jpg',
      backgroundImage: 'linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%)',
      cta: 'Shop Accessories',
    },
    {
      id: 2,
      title: 'Designed for modern devices',
      subtitle: 'Curated mobile accessories that blend style, performance, and protection.',
      backgroundImageUrl: 'https://i.ibb.co.com/kgktJNtn/product-2.jpg',
      backgroundImage: 'linear-gradient(135deg, rgba(240, 147, 251, 0.85) 0%, rgba(245, 87, 108, 0.85) 100%)',
      cta: 'Browse Collections',
    },
    {
      id: 3,
      title: 'Fast shipping on every order',
      subtitle: 'Free delivery on mobile accessory purchases over $79.',
      backgroundImageUrl: 'https://i.ibb.co.com/DP19cBtc/product-3.jpg',
      backgroundImage: 'linear-gradient(135deg, rgba(79, 172, 254, 0.85) 0%, rgba(0, 242, 254, 0.85) 100%)',
      cta: 'See Deals',
    },
  ];

  useEffect(() => {
    if (!autoPlay || isHovering) return;
    const interval = setInterval(() => {
      setPreviousSlide(currentSlide);
      setSlideDirection('right');
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay, isHovering, slides.length, currentSlide]);

  const scheduleResetPrevious = () => {
    setTimeout(() => setPreviousSlide(null), 520);
  };

  const handlePrevSlide = () => {
    setPreviousSlide(currentSlide);
    setSlideDirection('left');
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setAutoPlay(false);
    scheduleResetPrevious();
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const handleNextSlide = () => {
    setPreviousSlide(currentSlide);
    setSlideDirection('right');
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setAutoPlay(false);
    scheduleResetPrevious();
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const determineDirection = (targetIndex: number) => {
    const distance = (targetIndex - currentSlide + slides.length) % slides.length;
    return distance === 0 || distance <= slides.length / 2 ? 'right' : 'left';
  };

  const goToSlide = (index: number) => {
    if (index === currentSlide) return;
    setPreviousSlide(currentSlide);
    setSlideDirection(determineDirection(index));
    setCurrentSlide(index);
    setAutoPlay(false);
    scheduleResetPrevious();
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const handleCtaClick = () => {
    const slide = slides[currentSlide];
    if (slide.cta.includes('Shop') || slide.cta.includes('Browse') || slide.cta.includes('Deals')) {
      router.push('/products');
    }
  };

  return (
    <div
      className="hero-carousel-container"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Animated Background Orbs */}
      <div className="hero-carousel-orbs" aria-hidden="true">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="orb orb-4"></div>
        <div className="orb orb-5"></div>
        <div className="orb orb-6"></div>
      </div>

      <div className="hero-slides-track">
        {slides.map((slideItem, index) => {
          const isActive = index === currentSlide;
          const isPrevious = index === previousSlide;
          const classes = [
            'hero-slide',
            isActive ? 'active' : '',
            isActive ? `incoming-${slideDirection}` : '',
            isPrevious ? `outgoing-${slideDirection}` : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div
              key={slideItem.id}
              className={classes}
              style={{ background: slideItem.backgroundImage }}
            >
              <div className="hero-overlay"></div>
              <div className="hero-gradient-overlay"></div>
              <div className="hero-content-center">
                <div className="hero-content-inner">
                  <h1 className="hero-title">{slideItem.title}</h1>
                  <p className="hero-subtitle">{slideItem.subtitle}</p>
                  <button className="hero-cta-button" onClick={handleCtaClick}>
                    {slideItem.cta}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
          <button
            key={index}
            className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
