import React, { Suspense } from 'react';
import ProductsClientPage from './ProductsClientPage';

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="products-page-loading">Loading products...</div>}>
            <ProductsClientPage />
        </Suspense>
    );
}
