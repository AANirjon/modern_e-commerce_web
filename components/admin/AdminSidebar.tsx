'use client';

import React from 'react';
import Link from 'next/link';
import { FaTachometerAlt, FaBox, FaFire, FaEye, FaChevronLeft } from 'react-icons/fa';
import './AdminSidebar.css';

interface AdminSidebarProps {
  isOpen: boolean;
  isMobileOpen: boolean;
  onClose: () => void;
  toggleSidebar: () => void;
  currentPath: string;
}

export default function AdminSidebar({
  isOpen,
  isMobileOpen,
  onClose,
  toggleSidebar,
  currentPath,
}: AdminSidebarProps) {
  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: FaTachometerAlt },
    { label: 'Products', path: '/admin/products', icon: FaBox },
    { label: 'Flash Deals', path: '/admin/flash-deals', icon: FaFire },
    { label: 'Explore Now', path: '/admin/explore', icon: FaEye },
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'} ${isMobileOpen ? 'mobile-open' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">📊</div>
          {isOpen && <span className="logo-text">Admin</span>}
        </div>
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <FaChevronLeft size={18} />
        </button>
      </div>

      {/* Sidebar Menu */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-icon">
                <Icon size={20} />
              </span>
              {isOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <p className="version-text">v1.0.0</p>
      </div>
    </aside>
  );
}
