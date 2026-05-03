'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaShoppingCart } from 'react-icons/fa';
import './ProductCard.css';

interface ProductCardProps {
  id: number;
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
  id,
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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

        {/* Add to Cart Button */}
        <button className="add-to-cart-btn" aria-label={`Add ${name} to cart`}>
          <FaShoppingCart />
          <span>Add to Cart</span>
        </button>
      </div>

      {/* Product Info */}
      <div className="product-info">
        <p className="product-category">{category}</p>
        <h3 className="product-name">{name}</h3>

        {/* Rating */}
        <div className="product-rating">
          <span className="stars">★ {rating.toFixed(1)}</span>
          <span className="reviews">({reviews})</span>
        </div>

        {/* Price */}
        <div className="product-price">
          <span className="current-price">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="original-price">${originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
