'use client';

import React from 'react';
import ProductCard from '../ui/ProductCard';
import './ProductGrid.css';

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    discount: number;
    rating: number;
    reviews: number;
    image_url: string;
}

interface ProductGridProps {
    products: Product[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
    if (products.length === 0) {
        return (
            <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search criteria</p>
            </div>
        );
    }

    return (
        <div className="product-grid">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    category={product.category}
                    price={product.price}
                    image={product.image_url || '/placeholder.svg'}
                    rating={product.rating}
                    reviews={product.reviews}
                    discount={product.discount}
                />
            ))}
        </div>
    );
};

export default ProductGrid;
