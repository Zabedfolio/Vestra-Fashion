'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';
import Link from 'next/link';
import { CircleDollar, Box, Person, TShirt } from '@gravity-ui/icons';

// Sparkline graph SVG renderer
function Sparkline({ data, color = '#111111' }) {
  if (!data || data.length < 2) return null;
  const width = 120;
  const height = 30;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  
  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(' L ')}`;
  
  return (
    <svg className="w-24 h-6 opacity-85 flex-shrink-0" viewBox={`0 0 ${width} ${height}`}>
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DashboardOverviewPage() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => apiClient.get('/api/platform-stats'),
  });

  const [salesRange, setSalesRange] = useState('7days'); // 'today' | '7days' | '30days' | 'all'

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-zinc-200 rounded w-1/4 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-zinc-150 p-6 rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-white border border-zinc-150 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
        <h3 className="font-heading font-bold text-sm uppercase tracking-wider mb-2">Error Loading Analytics</h3>
        <p className="font-body text-xs">Failed to fetch platform metrics from the database server.</p>
      </div>
    );
  }

  let activeRevenueValue = stats.totalRevenue;
  let salesRangeLabel = 'Lifetime Sell';
  if (salesRange === 'today') {
    activeRevenueValue = stats.revenueToday ?? 0;
    salesRangeLabel = "Today's Sell";
  } else if (salesRange === '7days') {
    activeRevenueValue = stats.revenue7Days ?? 0;
    salesRangeLabel = "7 Days Sell";
  } else if (salesRange === '30days') {
    activeRevenueValue = stats.revenue30Days ?? 0;
    salesRangeLabel = "Monthly Sell";
  }

  // Find max value in chart data for layout calculation
  const maxRevenueVal = stats.chartData?.length > 0
    ? Math.max(...stats.chartData.map(c => c.revenue))
    : 1000;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title & Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-3xl text-dark uppercase tracking-tight leading-none mb-1">Overview</h1>
          <p className="font-body text-zinc-500 text-sm">Real-time metrics, product inventories, and sales trends.</p>
        </div>

        <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-[10px] font-heading font-bold uppercase tracking-wider">
          <button
            onClick={() => setSalesRange('today')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${salesRange === 'today' ? 'bg-white text-dark shadow-sm' : 'text-zinc-500 hover:text-dark'}`}
          >
            Today
          </button>
          <button
            onClick={() => setSalesRange('7days')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${salesRange === '7days' ? 'bg-white text-dark shadow-sm' : 'text-zinc-500 hover:text-dark'}`}
          >
            7 Days
          </button>
          <button
            onClick={() => setSalesRange('30days')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${salesRange === '30days' ? 'bg-white text-dark shadow-sm' : 'text-zinc-500 hover:text-dark'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSalesRange('all')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${salesRange === 'all' ? 'bg-white text-dark shadow-sm' : 'text-zinc-500 hover:text-dark'}`}
          >
            Lifetime
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue / Sales */}
        <div className="bg-white border border-zinc-150 p-6 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-heading font-bold text-zinc-400 uppercase tracking-wider">Revenue ({salesRangeLabel})</span>
            <CircleDollar className="w-5 h-5 text-dark" />
          </div>
          <div className="flex items-end justify-between mt-2">
            <div>
              <h3 className="text-2xl font-heading font-black text-dark">৳{activeRevenueValue.toLocaleString()}</h3>
              <p className="text-[9px] text-zinc-450 font-body uppercase mt-1">Stripe & Sandbox sales</p>
            </div>
            {stats.sparklines?.revenue && (
              <Sparkline data={stats.sparklines.revenue} color="#111111" />
            )}
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-zinc-150 p-6 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-heading font-bold text-zinc-400 uppercase tracking-wider">Total Orders</span>
            <Box className="w-5 h-5 text-dark" />
          </div>
          <div className="flex items-end justify-between mt-2">
            <div>
              <h3 className="text-2xl font-heading font-black text-dark">{stats.ordersCount}</h3>
              <p className="text-[9px] text-emerald-500 font-heading font-bold uppercase mt-1">+{stats.ordersToday} orders today</p>
            </div>
            {stats.sparklines?.orders && (
              <Sparkline data={stats.sparklines.orders} color="#10B981" />
            )}
          </div>
        </div>

        {/* Active Customers */}
        <div className="bg-white border border-zinc-150 p-6 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-heading font-bold text-zinc-400 uppercase tracking-wider">Customers</span>
            <Person className="w-5 h-5 text-dark" />
          </div>
          <div className="flex items-end justify-between mt-2">
            <div>
              <h3 className="text-2xl font-heading font-black text-dark">{stats.usersCount}</h3>
              <p className="text-[9px] text-zinc-450 font-body uppercase mt-1">Registered customer accounts</p>
            </div>
            {stats.sparklines?.users && (
              <Sparkline data={stats.sparklines.users} color="#6366F1" />
            )}
          </div>
        </div>

        {/* Products Count */}
        <div className="bg-white border border-zinc-150 p-6 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-heading font-bold text-zinc-400 uppercase tracking-wider">Catalog Products</span>
            <TShirt className="w-5 h-5 text-dark" />
          </div>
          <div className="flex items-end justify-between mt-2">
            <div>
              <h3 className="text-2xl font-heading font-black text-dark">{stats.productsCount}</h3>
              {stats.lowStockCount > 0 ? (
                <p className="text-[9px] text-red-500 font-heading font-bold uppercase mt-1">{stats.lowStockCount} items in low stock</p>
              ) : (
                <p className="text-[9px] text-zinc-450 font-body uppercase mt-1">All items in stock</p>
              )}
            </div>
            {stats.sparklines?.products && (
              <Sparkline data={stats.sparklines.products} color="#F59E0B" />
            )}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white border border-zinc-150 rounded-2xl p-6 shadow-sm">
        <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-dark mb-6">Weekly Revenue Trend</h3>
        
        {stats.chartData && stats.chartData.length > 0 ? (
          <div className="h-64 flex items-end gap-3 sm:gap-6 pt-4">
            {stats.chartData.map((data, index) => {
              const heightPercent = maxRevenueVal > 0 ? (data.revenue / maxRevenueVal) * 80 + 10 : 10;
              return (
                <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group">
                  {/* Tooltip */}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-dark text-[#C9FA75] text-[10px] font-heading font-bold tracking-wide px-2 py-1 rounded mb-2 shadow-sm font-mono z-10">
                    ৳{data.revenue.toLocaleString()}
                  </span>
                  {/* Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-[#111111] group-hover:bg-[#C9FA75] rounded-t-lg transition-all duration-300 relative"
                  />
                  {/* Label */}
                  <span className="text-[9px] font-heading font-bold uppercase tracking-wider text-zinc-400 mt-3 truncate w-full text-center">
                    {data.date}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center border border-dashed border-zinc-200 rounded-xl">
            <p className="font-heading font-bold text-xs text-zinc-400 uppercase">Insufficient transaction data to display trend</p>
          </div>
        )}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-zinc-150 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-150 flex justify-between items-center">
          <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-dark">Recent Activity</h3>
          <Link
            href="/dashboard/orders"
            className="text-xs font-heading font-bold text-dark hover:underline uppercase tracking-wider"
          >
            All Orders →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400">
                <th className="px-6 py-4.5">Order ID</th>
                <th className="px-6 py-4.5">Customer</th>
                <th className="px-6 py-4.5">Items Count</th>
                <th className="px-6 py-4.5">Total Price</th>
                <th className="px-6 py-4.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-body">
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-zinc-500">{order._id}</td>
                    <td className="px-6 py-4 font-semibold">{order.userName || order.userEmail}</td>
                    <td className="px-6 py-4">{order.items?.reduce((sum, i) => sum + i.qty, 0) || 0} items</td>
                    <td className="px-6 py-4 font-bold">৳{order.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-heading font-bold uppercase tracking-wider ${
                        order.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'delivered' ? 'bg-zinc-100 text-dark' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-zinc-100 text-zinc-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-zinc-400 font-heading font-bold uppercase tracking-wider">No recent orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
