'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FaEdit, FaTrash, FaPlus, FaUpload } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import { createExploreSectionAction, updateExploreSectionAction, deleteExploreSectionAction, uploadExploreImageAction, deleteExploreImageAction } from '@/app/admin/actions';
import AdminLayout from '@/components/admin/AdminLayout';
import './AdminExplore.css';

interface ExploreSection {
  id: string;
  title: string;
  image_url: string;
  image_path: string;
  is_large: boolean;
  sort_order: number;
}

export default function AdminExplore() {
  const [sections, setSections] = useState<ExploreSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    is_large: false,
    sort_order: 0,
  });

  const fetchSections = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('explore_sections')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching explore sections:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    fetchSections();
  }, [fetchSections]);

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

    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      let imageUrl = '';
      let imagePath = '';

      if (previewUrl && previewUrl.startsWith('data:')) {
        const file = fileInputRef.current?.files?.[0];
        if (file) {
          const currentSection = sections.find(s => s.id === editingId);
          if (currentSection?.image_path) {
            await deleteExploreImageAction(currentSection.image_path);
          }

          const arrayBuffer = await file.arrayBuffer();

          const result = await uploadExploreImageAction(arrayBuffer, file.name, editingId || 'new-' + Date.now());
          imageUrl = result.url;
          imagePath = result.path;

          // Update preview to show the uploaded image URL
          setPreviewUrl(imageUrl);
        }
      } else if (editingId && !previewUrl) {
        const currentSection = sections.find(s => s.id === editingId);
        imageUrl = currentSection?.image_url || '';
        imagePath = currentSection?.image_path || '';
      }

      const sectionData = {
        title: formData.title,
        is_large: formData.is_large,
        sort_order: formData.sort_order,
        image_url: imageUrl,
        image_path: imagePath,
      };

      if (editingId) {
        await updateExploreSectionAction(editingId, sectionData);
      } else {
        await createExploreSectionAction(sectionData);
      }

      setShowForm(false);
      setEditingId(null);
      setPreviewUrl('');
      setFormData({ title: '', is_large: false, sort_order: 0 });
      fetchSections();
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Failed to save section');
    }
  };

  const handleDelete = async (section: ExploreSection) => {
    if (!confirm('Delete this section?')) return;

    try {
      if (section.image_path) {
        await deleteExploreImageAction(section.image_path);
      }

      await deleteExploreSectionAction(section.id);
      setSections(sections.filter(s => s.id !== section.id));
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Failed to delete section');
    }
  };

  const handleEdit = (section: ExploreSection) => {
    setFormData({
      title: section.title,
      is_large: section.is_large,
      sort_order: section.sort_order,
    });
    setPreviewUrl(section.image_url);
    setEditingId(section.id);
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <div className="explore-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Explore Now Management</h1>
            <p className="page-subtitle">Manage solution cards</p>
          </div>
          <button className="btn-primary btn-lg" onClick={() => setShowForm(true)}>
            <FaPlus /> Add Section
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h3>{editingId ? 'Edit Section' : 'Add New Section'}</h3>
            <form onSubmit={handleSubmit} className="explore-form">
              <div className="form-group">
                <label>Image</label>
                <div className="image-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="file-input"
                  />
                  {previewUrl ? (
                    <div className="image-preview">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewUrl} alt="Preview" />
                    </div>
                  ) : (
                    <div className="upload-placeholder" onClick={() => fileInputRef.current?.click()}>
                      <FaUpload size={32} />
                      <p>Click to upload</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter section title"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Sort Order</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.is_large}
                      onChange={(e) => setFormData({ ...formData, is_large: e.target.checked })}
                    />
                    Large Card
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setPreviewUrl('');
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

        {/* Sections Grid */}
        <div className="sections-grid">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading sections...</p>
            </div>
          ) : sections.length === 0 ? (
            <div className="empty-state">
              <p>No sections yet</p>
            </div>
          ) : (
            sections.map((section) => (
              <div
                key={section.id}
                className={`section-card ${section.is_large ? 'large' : ''}`}
              >
                <div className="section-image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={section.image_url} alt={section.title} />
                </div>
                <div className="section-content">
                  <h4>{section.title}</h4>
                  <p>Order: {section.sort_order}</p>
                  {section.is_large && <span className="large-badge">Large</span>}
                  <div className="section-actions">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => handleEdit(section)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(section)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
