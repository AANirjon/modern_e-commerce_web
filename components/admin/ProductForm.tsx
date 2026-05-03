'use client';

import React, { useState, useRef } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';
import { createProductAction, updateProductAction, uploadProductImageAction, deleteProductImageAction } from '@/app/admin/actions';
import './ProductForm.css';

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  discount: number;
  rating: number;
  reviews: number;
  in_stock: boolean;
  is_flash_deal: boolean;
  image_url: string;
  image_path: string;
}

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books'];

export default function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>(
    product || {
      name: '',
      description: '',
      price: 0,
      category: 'Electronics',
      discount: 0,
      rating: 0,
      reviews: 0,
      in_stock: true,
      is_flash_deal: false,
      image_url: '',
      image_path: '',
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(product?.image_url || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.discount < 0 || formData.discount > 100) newErrors.discount = 'Discount must be between 0-100';
    if (formData.rating < 0 || formData.rating > 5) newErrors.rating = 'Rating must be between 0-5';
    if (formData.reviews < 0) newErrors.reviews = 'Reviews cannot be negative';
    if (!product && !previewUrl) newErrors.image = 'Product image is required for new products';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      let imageUrl = formData.image_url;
      let imagePath = formData.image_path;

      // Handle image upload if new image is selected
      if (previewUrl && previewUrl.startsWith('data:')) {
        const file = fileInputRef.current?.files?.[0];
        if (file) {
          // Delete old image if exists
          if (product?.image_path) {
            await deleteProductImageAction(product.image_path);
          }

          // Get file as ArrayBuffer and upload using server action
          const arrayBuffer = await file.arrayBuffer();

          const result = await uploadProductImageAction(
            arrayBuffer,
            file.name,
            product?.id || 'new-' + Date.now()
          );

          imageUrl = result.url;
          imagePath = result.path;

          // Update preview to show the uploaded image URL
          setPreviewUrl(imageUrl);
        }
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        discount: formData.discount,
        rating: formData.rating,
        reviews: formData.reviews,
        in_stock: formData.in_stock,
        is_flash_deal: formData.is_flash_deal,
        image_url: imageUrl,
        image_path: imagePath,
      };

      if (product?.id) {
        // Update existing product using server action
        await updateProductAction(product.id, productData);
      } else {
        // Create new product using server action
        await createProductAction(productData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-modal-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="form-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {/* Image Upload */}
          <div className="form-group">
            <label>Product Image</label>
            <div className="image-upload-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="file-input"
              />
              {previewUrl && (
                <div className="image-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Preview" />
                </div>
              )}
              {!previewUrl && (
                <div className="upload-placeholder" onClick={() => fileInputRef.current?.click()}>
                  <FaUpload size={32} />
                  <p>Click to upload image</p>
                </div>
              )}
            </div>
            {errors.image && <span className="error-text">{errors.image}</span>}
          </div>

          {/* Name */}
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? 'input-error' : ''}
              placeholder="Enter product name"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={errors.description ? 'input-error' : ''}
              placeholder="Enter product description"
              rows={4}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          {/* Price & Discount */}
          <div className="form-row">
            <div className="form-group">
              <label>Price ($) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : 0 })}
                className={errors.price ? 'input-error' : ''}
                placeholder="0.00"
              />
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label>Discount (%) *</label>
              <input
                type="number"
                step="1"
                value={formData.discount || ''}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value ? parseInt(e.target.value) : 0 })}
                className={errors.discount ? 'input-error' : ''}
                placeholder="0"
                min="0"
                max="100"
              />
              {errors.discount && <span className="error-text">{errors.discount}</span>}
            </div>
          </div>

          {/* Category & Rating */}
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Rating *</label>
              <input
                type="number"
                step="0.1"
                value={formData.rating || ''}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value ? parseFloat(e.target.value) : 0 })}
                className={errors.rating ? 'input-error' : ''}
                placeholder="0.0"
                min="0"
                max="5"
              />
              {errors.rating && <span className="error-text">{errors.rating}</span>}
            </div>
          </div>

          {/* Reviews */}
          <div className="form-group">
            <label>Number of Reviews *</label>
            <input
              type="number"
              step="1"
              value={formData.reviews || ''}
              onChange={(e) => setFormData({ ...formData, reviews: e.target.value ? parseInt(e.target.value) : 0 })}
              className={errors.reviews ? 'input-error' : ''}
              placeholder="0"
              min="0"
            />
            {errors.reviews && <span className="error-text">{errors.reviews}</span>}
          </div>

          {/* Checkboxes */}
          <div className="form-checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.in_stock}
                onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
              />
              In Stock
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.is_flash_deal}
                onChange={(e) => setFormData({ ...formData, is_flash_deal: e.target.checked })}
              />
              Flash Deal
            </label>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
