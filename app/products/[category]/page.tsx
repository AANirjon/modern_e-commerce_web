'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { Navbar } from '@/components/layout/Navbar';
import ProductFilters from '@/components/products/ProductFilters';
import ProductSortBar from '@/components/products/ProductSortBar';
import ProductGrid from '@/components/products/ProductGrid';
import Pagination from '@/components/products/Pagination';
import { mockProducts, Product } from '@/lib/mockProducts';
import '../../products.css';

const PRODUCTS_PER_PAGE = 12;

interface FilterState {
    category: string;
    priceRange: [number, number];
    rating: number;
    inStock: boolean;
}

export default function CategoryProductsPage() {
    const params = useParams();
    const category = decodeURIComponent(params.category as string);

    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('relevance');
    const [filters, setFilters] = useState<FilterState>({
        category: category,
        priceRange: [0, 999],
        rating: 0,
        inStock: false,
    });

    // Get unique categories
    const categories = Array.from(new Set(mockProducts.map((p) => p.category)));

    // Filter products
    const filteredProducts = useMemo(() => {
        return mockProducts.filter((product) => {
            const categoryMatch = product.category === category;
            const priceMatch =
                product.price >= filters.priceRange[0] &&
                product.price <= filters.priceRange[1];
            const ratingMatch = !filters.rating || product.rating >= filters.rating;
            const stockMatch = !filters.inStock || product.inStock;

            return categoryMatch && priceMatch && ratingMatch && stockMatch;
        });
    }, [filters]);

    // Sort products
    const sortedProducts = useMemo(() => {
        const products = [...filteredProducts];

        switch (sortBy) {
            case 'price-low':
                return products.sort((a, b) => a.price - b.price);
            case 'price-high':
                return products.sort((a, b) => b.price - a.price);
            case 'rating':
                return products.sort((a, b) => b.rating - a.rating);
            case 'reviews':
                return products.sort((a, b) => b.reviews - a.reviews);
            case 'newest':
                return products.reverse();
            case 'relevance':
            default:
                return products;
        }
    }, [filteredProducts, sortBy]);

    // Paginate products
    const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
        const endIndex = startIndex + PRODUCTS_PER_PAGE;
        return sortedProducts.slice(startIndex, endIndex);
    }, [sortedProducts, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFilterChange = (newFilters: FilterState) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page when filters change
    };

    return (
        <div className="products-page">
            <TopBar />
            <Navbar />

            <main className="products-main">
                <div className="products-container">
                    {/* Page Header */}
                    <div className="products-header">
                        <h1>{category}</h1>
                        <p>Explore our {category.toLowerCase()} collection</p>
                    </div>

                    {/* Filters and Products */}
                    <div className="products-layout">
                        {/* Sidebar Filters */}
                        <ProductFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            categories={categories}
                        />

                        {/* Main Content */}
                        <section className="products-content">
                            {/* Sort Bar */}
                            <ProductSortBar
                                sortBy={sortBy}
                                onSortChange={setSortBy}
                                totalProducts={sortedProducts.length}
                            />

                            {/* Product Grid */}
                            <ProductGrid products={paginatedProducts} />

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
