'use client';

import { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Navbar } from '@/components/layout/Navbar';
import { SearchBar } from '@/components/home/SearchBar';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { FlashDeals } from '@/components/home/FlashDeals';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';
import './page.css';
import CustomSolutionsSection from '@/components/home/CustomSolutionsSection';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="page-wrapper">
      {/* Top Bar */}
      <TopBar />

      {/* Navbar */}
      <Navbar />

      {/* Search Bar */}
      <SearchBar onCategoryChange={setSelectedCategory} />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Flash Deals Section */}
      <FlashDeals category={selectedCategory !== 'all' ? selectedCategory : undefined} />

      {/* Custom Solutions Section */}
      <CustomSolutionsSection />

      {/* Additional Sections Placeholder */}
      <section className="coming-soon-section">
        <div className="container">
          <h2 className="coming-soon-title">More Sections Coming Soon</h2>
          <p className="coming-soon-subtitle">Categories, Featured Collections, and more...</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <h3 className="footer-heading">About</h3>
              <ul className="footer-list">
                <li><a href="#" className="footer-link">About Us</a></li>
                <li><a href="#" className="footer-link">Careers</a></li>
                <li><a href="#" className="footer-link">Press</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-heading">Support</h3>
              <ul className="footer-list">
                <li><a href="#" className="footer-link">Help Center</a></li>
                <li><a href="#" className="footer-link">Contact Us</a></li>
                <li><a href="#" className="footer-link">FAQs</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-heading">Legal</h3>
              <ul className="footer-list">
                <li><a href="#" className="footer-link">Privacy</a></li>
                <li><a href="#" className="footer-link">Terms</a></li>
                <li><a href="#" className="footer-link">Cookies</a></li>
              </ul>
            </div>
            <div className="footer-column footer-contact-column">
              <h3 className="footer-heading">Contact & Follow</h3>
              <div className="footer-contact-info">
                <div className="contact-item">
                  <FaPhone className="contact-icon" />
                  <a href="tel:+1234567890" className="contact-link">+1 (234) 567-890</a>
                </div>
                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <a href="mailto:hello@bazaar.com" className="contact-link">hello@bazaar.com</a>
                </div>
              </div>
              <div className="footer-social-icons">
                <a href="#" className="social-icon facebook" title="Facebook" aria-label="Follow on Facebook">
                  <FaFacebook />
                </a>
                <a href="#" className="social-icon twitter" title="Twitter" aria-label="Follow on Twitter">
                  <FaTwitter />
                </a>
                <a href="#" className="social-icon instagram" title="Instagram" aria-label="Follow on Instagram">
                  <FaInstagram />
                </a>
                <a href="#" className="social-icon linkedin" title="LinkedIn" aria-label="Follow on LinkedIn">
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-column">
            <h3 className="footer-heading">Newsletter</h3>
            <p className="footer-newsletter-text">Subscribe for exclusive offers and updates</p>
            <input
              type="email"
              placeholder="Enter your email"
              className="footer-input"
            />
          </div>
          <div className="footer-divider"></div>
          <div className="footer-bottom">
            <p>&copy; 2026 Bazaar eCommerce. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
