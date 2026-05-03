'use client';

import React from 'react';
import './ProductSortBar.css';

interface ProductSortBarProps {
    sortBy: string;
    onSortChange: (sortBy: string) => void;
    totalProducts: number;
}

export const ProductSortBar: React.FC<ProductSortBarProps> = ({
    sortBy,
    onSortChange,
    totalProducts,
}) => {
    const sortOptions = [
        { value: 'relevance', label: 'Relevance' },
        { value: 'newest', label: 'Newest' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'rating', label: 'Highest Rating' },
        { value: 'reviews', label: 'Most Reviews' },
    ];

    return (
        <div className="sort-bar">
            <p className="products-count">
                Showing <strong>{totalProducts}</strong> products
            </p>

            <div className="sort-select-wrapper">
                <label htmlFor="sort-select" className="sort-label">
                    Sort by:
                </label>
                <select
                    id="sort-select"
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default ProductSortBar;
