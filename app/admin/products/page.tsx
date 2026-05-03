'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import { deleteProductAction, deleteProductImageAction } from '@/app/admin/actions';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';
import './AdminProducts.css';

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

const ITEMS_PER_PAGE = 10;
export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' });

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(
          (currentPage - 1) * ITEMS_PER_PAGE,
          currentPage * ITEMS_PER_PAGE - 1
        );

      if (error) throw error;

      setProducts(data || []);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    // eslint-disable-next-line
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string, imagePath: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      // Delete image if exists using server action
      if (imagePath) {
        await deleteProductImageAction(imagePath);
      }

      // Use server action to delete product
      await deleteProductAction(id);

      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <div className="products-container">
        <div className="products-header">
          <div>
            <h1 className="page-title">Products Management</h1>
            <p className="page-subtitle">Manage all your products</p>
          </div>
          <button className="btn-primary btn-lg" onClick={handleAddNew}>
            <FaPlus /> Add Product
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <ProductForm
            product={editingProduct}
            onClose={handleCloseForm}
            onSuccess={() => {
              handleCloseForm();
              fetchProducts();
            }}
          />
        )}

        {/* Products Table */}
        <div className="products-table-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>No products found</p>
              <button className="btn-primary" onClick={handleAddNew}>
                Create your first product
              </button>
            </div>
          ) : (
            <>
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Rating</th>
                    <th>Stock</th>
                    <th>Flash Deal</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="image-cell">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image_url || '/placeholder.svg'}
                          alt={product.name}
                          className="product-thumbnail"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </td>
                      <td className="name-cell">{product.name}</td>
                      <td>{product.category}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>{product.discount}%</td>
                      <td>
                        <span className="rating-badge">⭐ {product.rating}</span>
                      </td>
                      <td>
                        {product.in_stock ? (
                          <span className="badge badge-success">In Stock</span>
                        ) : (
                          <span className="badge badge-error">Out of Stock</span>
                        )}
                      </td>
                      <td>
                        {product.is_flash_deal ? (
                          <span className="badge badge-warning">🔥 Yes</span>
                        ) : (
                          <span className="badge badge-gray">No</span>
                        )}
                      </td>
                      <td className="actions-cell">
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => handleEdit(product)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDelete(product.id, product.image_path)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="pagination">
                <button
                  className="btn-pagination"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn-pagination"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
