'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import './AdminFlashDeals.css';

interface FlashDeal {
  id: string;
  product_id: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  product?: { name: string };
}

interface Product {
  id: string;
  name: string;
}

export default function AdminFlashDeals() {
  const [flashDeals, setFlashDeals] = useState<FlashDeal[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    discount_percentage: 10,
    start_date: '',
    end_date: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchFlashDeals = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('flash_deals')
        .select(`
          id,
          product_id,
          discount_percentage,
          start_date,
          end_date,
          is_active,
          products(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFlashDeals(data || []);
    } catch (error) {
      console.error('Error fetching flash deals:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .eq('in_stock', true);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    fetchFlashDeals();
    fetchProducts();
  }, [fetchFlashDeals, fetchProducts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.product_id || !formData.start_date || !formData.end_date) {
      alert('Please fill all fields');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('flash_deals')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('flash_deals')
          .insert([formData]);

        if (error) throw error;
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        product_id: '',
        discount_percentage: 10,
        start_date: '',
        end_date: '',
      });
      fetchFlashDeals();
    } catch (error) {
      console.error('Error saving flash deal:', error);
      alert('Failed to save flash deal');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this flash deal?')) return;

    try {
      const { error } = await supabase
        .from('flash_deals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setFlashDeals(flashDeals.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting flash deal:', error);
      alert('Failed to delete flash deal');
    }
  };

  const handleEdit = (deal: FlashDeal) => {
    setFormData({
      product_id: deal.product_id,
      discount_percentage: deal.discount_percentage,
      start_date: deal.start_date.split('T')[0],
      end_date: deal.end_date.split('T')[0],
    });
    setEditingId(deal.id);
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <div className="flash-deals-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Flash Deals Management</h1>
            <p className="page-subtitle">Manage limited-time offers</p>
          </div>
          <button className="btn-primary btn-lg" onClick={() => setShowForm(true)}>
            <FaPlus /> Add Flash Deal
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h3>
              {editingId ? 'Edit Flash Deal' : 'Create New Flash Deal'}
            </h3>
            <form onSubmit={handleSubmit} className="flash-form">
              <div className="form-group">
                <label>Product *</label>
                <select
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Discount (%) *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_percentage: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Flash Deals List */}
        <div className="deals-list">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading flash deals...</p>
            </div>
          ) : flashDeals.length === 0 ? (
            <div className="empty-state">
              <p>No flash deals yet</p>
            </div>
          ) : (
            flashDeals.map((deal) => (
              <div key={deal.id} className="deal-card">
                <div className="deal-header">
                  <div>
                    <h4>{deal.product?.name}</h4>
                    <span className="discount-badge">{deal.discount_percentage}% OFF</span>
                  </div>
                  <div className="deal-actions">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => handleEdit(deal)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(deal.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="deal-dates">
                  <p>
                    <strong>Start:</strong> {new Date(deal.start_date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>End:</strong> {new Date(deal.end_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="deal-status">
                  {deal.is_active ? (
                    <span className="badge badge-success">🔥 Active</span>
                  ) : (
                    <span className="badge badge-gray">Inactive</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
