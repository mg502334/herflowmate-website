import React, { useMemo, useState } from 'react';
import { useOrders } from '../data/useOrders';
import { TrendingUp, DollarSign, ShoppingBag, ArrowUpRight, ArrowDownRight, Package, Calendar, Printer } from 'lucide-react';
import { format, parseISO, isToday, isThisWeek, isThisMonth, isThisYear, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, eachHourOfInterval, eachDayOfInterval, eachMonthOfInterval } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ReportPreFlightModal, ReportConfig } from './ReportPreFlightModal';
import { generatePrintableReport } from './reportGenerator';
import { useStoreSettings } from '../data/useStoreSettings';

export function AnalyticsPage() {
  const { orders, loading } = useOrders();
  const { settings } = useStoreSettings();
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month' | 'year' | 'all' | 'projection-5y'>('all');
  const [showModal, setShowModal] = useState(false);

  const metrics = useMemo(() => {
    if (!orders) return null;

    // Filter out canceled orders
    const activeOrders = orders.filter(o => o.status !== 'Canceled');
    
    // Apply time filter
    const filteredOrders = activeOrders.filter(o => {
      if (timeFilter === 'projection-5y') return true; // use all active orders as base
      if (!o.created_at) return false;
      const date = parseISO(o.created_at);
      if (timeFilter === 'day') return isToday(date);
      if (timeFilter === 'week') return isThisWeek(date);
      if (timeFilter === 'month') return isThisMonth(date);
      if (timeFilter === 'year') return isThisYear(date);
      return true;
    });

    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Build Chart Data
    const chartDataObj: Record<string, number> = {};
    const now = new Date();

    if (timeFilter === 'day') {
      eachHourOfInterval({ start: startOfDay(now), end: endOfDay(now) }).forEach(h => chartDataObj[format(h, 'HH:00')] = 0);
    } else if (timeFilter === 'week') {
      eachDayOfInterval({ start: startOfWeek(now), end: endOfWeek(now) }).forEach(d => chartDataObj[format(d, 'MMM dd')] = 0);
    } else if (timeFilter === 'month') {
      eachDayOfInterval({ start: startOfMonth(now), end: endOfMonth(now) }).forEach(d => chartDataObj[format(d, 'MMM dd')] = 0);
    } else if (timeFilter === 'year') {
      eachMonthOfInterval({ start: startOfYear(now), end: endOfYear(now) }).forEach(m => chartDataObj[format(m, 'MMM yyyy')] = 0);
    }

    filteredOrders.forEach(o => {
      const date = parseISO(o.created_at);
      let key = '';
      if (timeFilter === 'day') key = format(date, 'HH:00');
      else if (timeFilter === 'week' || timeFilter === 'month') key = format(date, 'MMM dd');
      else key = format(date, 'MMM yyyy');
      
      if (chartDataObj[key] !== undefined) {
         chartDataObj[key] += (o.total || 0);
      } else if (timeFilter === 'all') {
         chartDataObj[key] = (chartDataObj[key] || 0) + (o.total || 0);
      }
    });

    let chartData = [];
    if (timeFilter === 'projection-5y') {
      // 5-Year Annual Projection based on all-time data
      const firstOrderDate = activeOrders.length > 0 ? new Date(activeOrders[activeOrders.length - 1].created_at).getTime() : now.getTime();
      const historyYears = Math.max(1, (now.getTime() - firstOrderDate) / (1000 * 60 * 60 * 24 * 365));
      const baseAnnualRevenue = totalRevenue / historyYears || 5000; // Fallback to 5k base if no data
      const assumedAnnualGrowth = 0.25; // Assume 25% YoY growth

      let currentYearRev = baseAnnualRevenue;
      for (let i = 1; i <= 5; i++) {
        currentYearRev = currentYearRev * (1 + assumedAnnualGrowth);
        chartData.push({ name: (now.getFullYear() + i).toString(), revenue: currentYearRev });
      }
    } else if (timeFilter === 'all') {
      chartData = Object.keys(chartDataObj)
        .sort((a,b) => new Date(a).getTime() - new Date(b).getTime())
        .map(k => ({ name: k, revenue: chartDataObj[k] }));
    } else {
      chartData = Object.keys(chartDataObj).map(k => ({ name: k, revenue: chartDataObj[k] }));
    }

    // Aggregate product sales
    const itemSales: Record<string, { name: string; qty: number; revenue: number }> = {};

    filteredOrders.forEach(order => {
      if (Array.isArray(order.line_items)) {
        order.line_items.forEach((item: any) => {
          if (item && item.name) {
            if (!itemSales[item.name]) {
              itemSales[item.name] = { name: item.name, qty: 0, revenue: 0 };
            }
            itemSales[item.name].qty += (item.qty || 1);
            itemSales[item.name].revenue += ((item.price || 0) * (item.qty || 1));
          }
        });
      }
    });

    const itemsArray = Object.values(itemSales);
    
    // Sort descending by quantity for popular items
    const mostPopular = [...itemsArray].sort((a, b) => b.qty - a.qty);
    
    // Sort ascending by quantity for least sold items (exclude zero-sellers naturally since they aren't in orders, 
    // but this gives us the lowest sellers among those that DID sell)
    const leastSold = [...itemsArray].sort((a, b) => a.qty - b.qty);

    // Get max qty for progress bars
    const maxQty = mostPopular.length > 0 ? mostPopular[0].qty : 1;

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      mostPopular: mostPopular.slice(0, 5),
      leastSold: leastSold.slice(0, 5),
      maxQty,
      chartData
    };
  }, [orders, timeFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#38BDF8] mr-3"></div>
        Loading analytics...
      </div>
    );
  }

  if (!metrics) return null;

  const handleGenerateReport = (config: ReportConfig) => {
    generatePrintableReport(metrics, settings, config);
    setShowModal(false);
  };

  return (
    <div className="space-y-8 max-w-6xl relative">
      {showModal && (
        <ReportPreFlightModal 
          onClose={() => setShowModal(false)} 
          onGenerate={handleGenerateReport}
        />
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <TrendingUp className="text-[#38BDF8] w-8 h-8" />
            Store Analytics
          </h1>
          <p className="text-gray-400 text-sm mb-4">Overview of your sales performance and product popularity.</p>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg"
          >
            <Printer className="w-4 h-4 mr-2" /> Print Professional Report
          </button>
        </div>
        
        {/* Time Filter */}
        <div className="flex items-center bg-[#1E293B] border border-gray-800 rounded-lg p-1">
          <Calendar className="w-4 h-4 text-gray-400 mx-2" />
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {(['day', 'week', 'month', 'year', 'all', 'projection-5y'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize whitespace-nowrap ${
                  timeFilter === filter 
                    ? filter === 'projection-5y' ? 'bg-purple-500 text-white' : 'bg-[#38BDF8] text-[#0F172A]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {filter === 'day' ? 'Today' : filter === 'week' ? 'This Week' : filter === 'month' ? 'This Month' : filter === 'year' ? 'This Year' : filter === 'all' ? 'All Time' : '5-Year Projection'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1E293B] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Total Revenue</p>
          <h3 className="text-3xl font-bold text-white">${metrics.totalRevenue.toFixed(2)}</h3>
        </div>

        <div className="bg-[#1E293B] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <ShoppingBag size={20} />
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Total Orders</p>
          <h3 className="text-3xl font-bold text-white">{metrics.totalOrders}</h3>
        </div>

        <div className="bg-[#1E293B] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Average Order Value</p>
          <h3 className="text-3xl font-bold text-white">${metrics.averageOrderValue.toFixed(2)}</h3>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-[#1E293B] border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">
          {timeFilter === 'projection-5y' ? 'Projected Revenue (25% YoY Growth Base)' : 'Revenue Over Time'}
        </h3>
        <div className="h-72 w-full">
          {metrics.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#38BDF8', fontWeight: 'bold' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke={timeFilter === 'projection-5y' ? "#a855f7" : "#38BDF8"} 
                  strokeWidth={3}
                  strokeDasharray={timeFilter === 'projection-5y' ? "5 5" : "0"}
                  dot={{ r: 4, fill: '#0F172A', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: timeFilter === 'projection-5y' ? "#a855f7" : "#38BDF8", stroke: '#0F172A', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex items-center justify-center h-full text-gray-500">
               No revenue data for this time period.
             </div>
          )}
        </div>
      </div>

      {/* Products Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Popular */}
        <div className="bg-[#1E293B] border border-gray-800 rounded-xl p-6 flex flex-col h-full">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <ArrowUpRight className="text-emerald-400" /> Most Popular Items
          </h3>
          
          <div className="space-y-6 flex-1">
            {metrics.mostPopular.length > 0 ? metrics.mostPopular.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-200">{item.name}</span>
                  <span className="text-gray-400">{item.qty} sold <span className="text-gray-600 mx-1">•</span> <span className="text-emerald-400">${item.revenue.toFixed(2)}</span></span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-400 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.max(5, (item.qty / metrics.maxQty) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )) : (
              <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full py-10">
                <Package className="w-8 h-8 mb-2 opacity-50" />
                <p>No sales data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Least Sold */}
        <div className="bg-[#1E293B] border border-gray-800 rounded-xl p-6 flex flex-col h-full">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <ArrowDownRight className="text-rose-400" /> Least Sold Items
          </h3>
          
          <div className="space-y-6 flex-1">
            {metrics.leastSold.length > 0 ? metrics.leastSold.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-200">{item.name}</span>
                  <span className="text-gray-400">{item.qty} sold <span className="text-gray-600 mx-1">•</span> <span className="text-emerald-400">${item.revenue.toFixed(2)}</span></span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-rose-400 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.max(5, (item.qty / metrics.maxQty) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )) : (
              <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full py-10">
                <Package className="w-8 h-8 mb-2 opacity-50" />
                <p>No sales data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
