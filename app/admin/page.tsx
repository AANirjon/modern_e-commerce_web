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
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .order('date', { ascending: true })
        .limit(30);

      if (error) throw error;

      if (data && data.length > 0) {
        setAnalyticsData(data);

        // Calculate metrics from latest data
        const latestData = data[data.length - 1];
        const previousData = data.length > 1 ? data[data.length - 2] : latestData;

        const calculateChange = (current: number, previous: number) => {
          const change = ((current - previous) / previous) * 100;
          return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
        };

        setMetrics([
          {
            label: 'Total Sales',
            value: `$${latestData.total_sales?.toFixed(2) || '0.00'}`,
            change: calculateChange(latestData.total_sales || 0, previousData.total_sales || 0),
            trend: (latestData.total_sales || 0) >= (previousData.total_sales || 0) ? 'up' : 'down',
            icon: '💰',
          },
          {
            label: 'Total Orders',
            value: latestData.total_orders || 0,
            change: calculateChange(latestData.total_orders || 0, previousData.total_orders || 0),
            trend: (latestData.total_orders || 0) >= (previousData.total_orders || 0) ? 'up' : 'down',
            icon: '📦',
          },
          {
            label: 'Total Products',
            value: latestData.total_products || 0,
            change: calculateChange(latestData.total_products || 0, previousData.total_products || 0),
            trend: (latestData.total_products || 0) >= (previousData.total_products || 0) ? 'up' : 'down',
            icon: '🛍️',
          },
          {
            label: 'Total Users',
            value: latestData.total_users || 0,
            change: calculateChange(latestData.total_users || 0, previousData.total_users || 0),
            trend: (latestData.total_users || 0) >= (previousData.total_users || 0) ? 'up' : 'down',
            icon: '👥',
          },
          {
            label: 'Revenue',
            value: `$${latestData.total_revenue?.toFixed(2) || '0.00'}`,
            change: calculateChange(latestData.total_revenue || 0, previousData.total_revenue || 0),
            trend: (latestData.total_revenue || 0) >= (previousData.total_revenue || 0) ? 'up' : 'down',
            icon: '💵',
          },
        ]);
      }
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
