'use client';

import React, { useState } from 'react';
import { FaFilter, FaChevronDown } from 'react-icons/fa';
import './ProductFilters.css';

interface FilterState {
    category: string;
    priceRange: [number, number];
    rating: number;
    inStock: boolean;
}

interface ProductFiltersProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    categories: string[];
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
    filters,
    onFilterChange,
    categories,
}) => {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState<{
        [key: string]: boolean;
    }>({
        categories: true,
        price: true,
        rating: true,
        stock: false,
    });

    const toggleSection = (section: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleCategoryChange = (category: string) => {
        onFilterChange({
            ...filters,
            category: filters.category === category ? '' : category,
        });
    };

    const handlePriceChange = (min: number, max: number) => {
        onFilterChange({
            ...filters,
            priceRange: [min, max],
        });
    };

    const handleRatingChange = (rating: number) => {
        onFilterChange({
            ...filters,
            rating: filters.rating === rating ? 0 : rating,
        });
    };

    const handleStockChange = () => {
        onFilterChange({
            ...filters,
            inStock: !filters.inStock,
        });
    };

    return (
        <aside className="product-filters">
            <button
                className="filters-toggle"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            >
                <FaFilter className="filter-icon" />
                <h3>Filters</h3>
                <FaChevronDown
                    className={`filters-chevron ${isFiltersOpen ? 'open' : ''}`}
                />
            </button>

            {isFiltersOpen && (
                <div className="filters-content">

                    {/* Categories - Dropdown */}
                    <div className="filter-section">
                        <button
                            className="filter-section-header"
                            onClick={() => toggleSection('categories')}
                        >
                            <h4 className="filter-title">Categories</h4>
                            <FaChevronDown
                                className={`section-chevron ${expandedSections.categories ? 'open' : ''
                                    }`}
                            />
                        </button>
                        {expandedSections.categories && (
                            <div className="filter-options">
                                {categories.map((cat) => (
                                    <label key={cat} className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={filters.category === cat}
                                            onChange={() => handleCategoryChange(cat)}
                                        />
                                        <span>{cat}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Price Range - Dropdown */}
                    <div className="filter-section">
                        <button
                            className="filter-section-header"
                            onClick={() => toggleSection('price')}
                        >
                            <h4 className="filter-title">Price Range</h4>
                            <FaChevronDown
                                className={`section-chevron ${expandedSections.price ? 'open' : ''
                                    }`}
                            />
                        </button>
                        {expandedSections.price && (
                            <div className="filter-options">
                                {[
                                    { label: 'Under $25', min: 0, max: 25 },
                                    { label: '$25 - $50', min: 25, max: 50 },
                                    { label: '$50 - $100', min: 50, max: 100 },
                                    { label: '$100 - $150', min: 100, max: 150 },
                                    { label: 'Over $150', min: 150, max: 999 },
                                ].map((range) => (
                                    <label key={range.label} className="filter-checkbox">
                                        <input
                                            type="radio"
                                            name="price"
                                            checked={
                                                filters.priceRange[0] === range.min &&
                                                filters.priceRange[1] === range.max
                                            }
                                            onChange={() =>
                                                handlePriceChange(range.min, range.max)
                                            }
                                        />
                                        <span>{range.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Rating - Dropdown */}
                    <div className="filter-section">
                        <button
                            className="filter-section-header"
                            onClick={() => toggleSection('rating')}
                        >
                            <h4 className="filter-title">Rating</h4>
                            <FaChevronDown
                                className={`section-chevron ${expandedSections.rating ? 'open' : ''
                                    }`}
                            />
                        </button>
                        {expandedSections.rating && (
                            <div className="filter-options">
                                {[5, 4, 3].map((rating) => (
                                    <label key={rating} className="filter-checkbox">
                                        <input
                                            type="radio"
                                            name="rating"
                                            checked={filters.rating === rating}
                                            onChange={() => handleRatingChange(rating)}
                                        />
                                        <span>★ {rating}+ Stars</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Stock Status - Dropdown */}
                    <div className="filter-section">
                        <button
                            className="filter-section-header"
                            onClick={() => toggleSection('stock')}
                        >
                            <h4 className="filter-title">Availability</h4>
                            <FaChevronDown
                                className={`section-chevron ${expandedSections.stock ? 'open' : ''
                                    }`}
                            />
                        </button>
                        {expandedSections.stock && (
                            <label className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    checked={filters.inStock}
                                    onChange={handleStockChange}
                                />
                                <span>In Stock Only</span>
                            </label>
                        )}
                    </div>
                </div>
            )}
        </aside>
    );
};

export default ProductFilters;
