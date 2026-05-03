'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Navbar } from '@/components/layout/Navbar';
import { supabase } from '@/lib/supabase';
import ProductFilters from '@/components/products/ProductFilters';
import ProductSortBar from '@/components/products/ProductSortBar';
import ProductGrid from '@/components/products/ProductGrid';
import Pagination from '@/components/products/Pagination';
import '../products.css';

const PRODUCTS_PER_PAGE = 12;

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    discount: number;
    rating: number;
    reviews: number;
    in_stock: boolean;
    is_flash_deal: boolean;
    image_url: string;
    image_path: string;
    description: string;
}

interface FilterState {
    category: string;
    priceRange: [number, number];
    rating: number;
    inStock: boolean;
}

export default function ProductsPage() {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('relevance');
    const [filters, setFilters] = useState<FilterState>({
        category: '',
        priceRange: [0, 100000],
        rating: 0,
        inStock: false,
    });
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [mobileSortOpen, setMobileSortOpen] = useState(false);

    // Fetch products from database
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setAllProducts(data || []);
            } catch (error) {
                console.error('Error fetching products:', error);
                setAllProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Get unique categories
    const categories = useMemo(() =>
        Array.from(new Set(allProducts.map((p) => p.category).filter(Boolean))),
        [allProducts]
    );

    // Filter products
    const filteredProducts = useMemo(() => {
        return allProducts.filter((product) => {
            const categoryMatch =
                !filters.category || product.category === filters.category;
            const priceMatch =
                product.price >= filters.priceRange[0] &&
                product.price <= filters.priceRange[1];
            const ratingMatch = !filters.rating || product.rating >= filters.rating;
            const stockMatch = !filters.inStock || product.in_stock;

            return categoryMatch && priceMatch && ratingMatch && stockMatch;
        });
    }, [filters, allProducts]);

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

    // Mobile overlay handlers (mutually exclusive)
    const handleOpenMobileFilter = () => {
        setMobileFilterOpen(true);
        setMobileSortOpen(false);
    };

    const handleOpenMobileSort = () => {
        setMobileSortOpen(true);
        setMobileFilterOpen(false);
    };

    const handleCloseMobileOverlays = () => {
        setMobileFilterOpen(false);
        setMobileSortOpen(false);
    };

    return (
        <div className="products-page">
            <TopBar />
            <Navbar />

            <main className="products-main">
                <div className="products-container">
                    {/* Page Header */}
                    <div className="products-header">
                        <h1>All Products</h1>
                    </div>

                    {/* Filters and Products */}
                    <div className="products-layout">
                        {/* Mobile Control Bar */}
                        <div className="mobile-controls">
                            <button
                                className={`control-btn ${mobileFilterOpen ? 'active' : ''}`}
                                onClick={handleOpenMobileFilter}
                            >
                                <span>🔽</span> Filters
                            </button>
                            <button
                                className={`control-btn ${mobileSortOpen ? 'active' : ''}`}
                                onClick={handleOpenMobileSort}
                            >
                                <span>↕️</span> Sort
                            </button>
                        </div>

                        {/* Backdrop Overlay for Mobile */}
                        {(mobileFilterOpen || mobileSortOpen) && (
                            <div
                                className="mobile-overlay-backdrop"
                                onClick={handleCloseMobileOverlays}
                            />
                        )}

                        {/* Sidebar Filters - Desktop & Mobile Overlay */}
                        <div
                            className={`filters-wrapper ${mobileFilterOpen ? 'mobile-overlay-open' : ''
                                }`}
                        >
                            <ProductFilters
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                categories={categories}
                            />
                        </div>

                        {/* Main Content */}
                        <section className="products-content">
                            {/* Sort Bar - Desktop & Mobile Overlay */}
                            <div
                                className={`sort-wrapper ${mobileSortOpen ? 'mobile-overlay-open' : ''
                                    }`}
                            >
                                <ProductSortBar
                                    sortBy={sortBy}
                                    onSortChange={setSortBy}
                                    totalProducts={sortedProducts.length}
                                />
                            </div>

                            {/* Product Grid */}
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <p>Loading products...</p>
                                </div>
                            ) : (
                                <>
                                    <ProductGrid products={paginatedProducts} />

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    )}
                                </>
                            )}
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
