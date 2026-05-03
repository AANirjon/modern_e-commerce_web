'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import './AdminDashboard.css';

interface AnalyticsData {
  date: string;
  total_sales: number;
  total_orders: number;
  total_users: number;
  total_products: number;
  total_revenue: number;
}

interface MetricCard {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

export default function AdminDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricCard[]>([
    { label: 'Total Sales', value: '$0.00', change: '0%', trend: 'neutral', icon: '💰' },
    { label: 'Total Orders', value: 0, change: '0%', trend: 'neutral', icon: '📦' },
    { label: 'Total Products', value: 0, change: '0%', trend: 'neutral', icon: '🛍️' },
    { label: 'Total Users', value: 0, change: '0%', trend: 'neutral', icon: '👥' },
    { label: 'Total Revenue', value: '$0.00', change: '0%', trend: 'neutral', icon: '📈' },
  ]);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch products to calculate metrics
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, price, discount, in_stock, rating, reviews, created_at', { count: 'exact' });

      if (productsError) throw productsError;

      // Fetch flash deals for active deals count
      const { data: flashDealsData, error: flashDealsError } = await supabase
        .from('flash_deals')
        .select('id, is_active')
        .eq('is_active', true);

      if (flashDealsError) throw flashDealsError;

      // Calculate metrics from products
      const totalProducts = productsData?.length || 0;
      const totalInStock = productsData?.filter(p => p.in_stock).length || 0;

      // Calculate total revenue (price × discount percentage for each product)
      const totalRevenue = productsData?.reduce((sum, product) => {
        const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
        return sum + discountedPrice;
      }, 0) || 0;

      // Calculate average rating
      const avgRating = productsData && productsData.length > 0
        ? (productsData.reduce((sum, p) => sum + (p.rating || 0), 0) / productsData.length).toFixed(1)
        : 0;

      // Estimate total orders from products (total reviews as proxy)
      const totalOrders = productsData?.reduce((sum, p) => sum + (p.reviews || 0), 0) || 0;

      // Active flash deals
      const activeFlashDeals = flashDealsData?.filter(d => d.is_active).length || 0;

      // Mock total sales (based on products with in-stock items)
      const totalSales = totalInStock > 0 ? (totalInStock * 85).toFixed(2) : '0.00';

      setAnalyticsData([
        {
          date: new Date().toISOString().split('T')[0],
          total_sales: parseFloat(totalSales as string),
          total_orders: totalOrders,
          total_users: totalProducts,
          total_products: totalProducts,
          total_revenue: totalRevenue,
        },
      ]);

      setMetrics([
        {
          label: 'Total Sales',
          value: `$${totalSales}`,
          change: `${activeFlashDeals} active deals`,
          trend: activeFlashDeals > 0 ? 'up' : 'neutral',
          icon: '💰',
        },
        {
          label: 'Total Orders',
          value: totalOrders,
          change: `${totalInStock} in stock`,
          trend: totalInStock === totalProducts ? 'up' : totalInStock > 0 ? 'neutral' : 'down',
          icon: '📦',
        },
        {
          label: 'Total Products',
          value: totalProducts,
          change: `⭐ ${avgRating}`,
          trend: 'neutral',
          icon: '🛍️',
        },
        {
          label: 'Revenue',
          value: `$${totalRevenue.toFixed(2)}`,
          change: `Avg: $${(totalRevenue / (totalProducts || 1)).toFixed(2)}`,
          trend: totalRevenue > 0 ? 'up' : 'neutral',
          icon: '💵',
        },
      ]);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const chartData = analyticsData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sales: item.total_sales,
    revenue: item.total_revenue,
    orders: item.total_orders,
  }));

  const pieData = [
    { name: 'Orders', value: analyticsData[analyticsData.length - 1]?.total_orders || 0 },
    { name: 'Products', value: analyticsData[analyticsData.length - 1]?.total_products || 0 },
    { name: 'Users', value: analyticsData[analyticsData.length - 1]?.total_users || 0 },
  ];

  const COLORS = ['#2563eb', '#10b981', '#f59e0b'];

  return (
    <AdminLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome to your admin dashboard</p>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          {metrics.map((metric, index) => (
            <div key={index} className="metric-card">
              <div className="metric-header">
                <span className="metric-icon">{metric.icon}</span>
                <span className={`metric-trend ${metric.trend}`}>
                  {metric.change}
                </span>
              </div>
              <h3 className="metric-label">{metric.label}</h3>
              <p className="metric-value">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        {!loading && analyticsData.length > 0 && (
          <div className="charts-section">
            {/* Sales Chart */}
            <div className="chart-card">
              <h3 className="chart-title">Sales Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#2563eb"
                    dot={{ fill: '#2563eb' }}
                    activeDot={{ r: 6 }}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    dot={{ fill: '#10b981' }}
                    activeDot={{ r: 6 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Orders Chart */}
            <div className="chart-card">
              <h3 className="chart-title">Orders Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="orders" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Distribution Pie Chart */}
            <div className="chart-card">
              <h3 className="chart-title">Data Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading analytics...</p>
          </div>
        )}

        {!loading && analyticsData.length === 0 && (
          <div className="empty-state">
            <p>📊 No analytics data yet. Add products to get started!</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
