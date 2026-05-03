'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaShoppingCart } from 'react-icons/fa';
import './ProductCard.css';

interface ProductCardProps {
  id: string | number;
  image: string;
  category: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  discount?: number;
}

function ProductCard({
  image,
  category,
  name,
  price,
  originalPrice,
  rating,
  reviews,
  discount,
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="product-card">
      {/* Image Container */}
      <div className="product-image-container">
        {isLoading && <div className="skeleton"></div>}
        <Image
          src={image}
          alt={name}
          width={250}
          height={250}
          onLoad={() => setIsLoading(false)}
          className="product-image"
          priority
        />

        {/* Discount Badge */}
        {discount && (
          <div className="discount-badge">{discount}% OFF</div>
        )}

        {/* Wishlist Button */}
        <button
          className={`wishlist-btn ${isWishlisted ? 'liked' : ''}`}
          onClick={() => setIsWishlisted(!isWishlisted)}
          aria-label="Add to wishlist"
        >
          {isWishlisted ? '♥' : '♡'}
        </button>
      </div>

      {/* Product Info */}
      <div className="product-info">
        <p className="product-category">{category}</p>
        <h3 className="product-name">{name}</h3>

        {/* Rating */}
        <div className="product-rating">
          <span className="rating-stars">★</span>
          <span className="rating-value">{rating.toFixed(1)}</span>
          <span className="rating-count">({reviews} reviews)</span>
        </div>

        {/* Price */}
        <div className="product-price">
          <span className="price-current">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="price-original">${originalPrice.toFixed(2)}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button className="add-to-cart-btn" aria-label={`Add ${name} to cart`}>
          <FaShoppingCart />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
