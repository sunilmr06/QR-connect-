import React, { useEffect, useState } from 'react';
import { cardService } from '../services/api';
import { Users, QrCode, Eye, Download, TrendingUp, Award, RefreshCw, BarChart2 } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await cardService.getDashboardAnalytics();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to retrieve platform analytics. Make sure the backend server is running.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-purple-500 border-r-transparent border-slate-800 rounded-full animate-spin mb-4" />
        <p className="text-xs text-gray-500">Retrieving system stats...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mb-4 inline-block">
          <BarChart2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Analytics Offline</h2>
        <p className="text-xs text-gray-400 leading-relaxed mb-6">{error}</p>
        <button 
          onClick={handleRefresh}
          className="flex items-center space-x-1.5 px-5 py-2 bg-slate-900 border border-gray-800 rounded-xl text-xs text-gray-300 hover:text-white mx-auto transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  // Calculate SVG Chart dimensions
  const chartWidth = 500;
  const chartHeight = 150;
  const padding = 20;

  // Render SVG Bar Chart for Daily Registrations
  const renderRegistrationsChart = () => {
    const data = stats.daily_registrations || [];
    if (data.length === 0) return null;

    const maxVal = Math.max(...data.map(d => d.count), 5); // default min height scale
    const stepX = (chartWidth - padding * 2) / (data.length - 1 || 1);
    
    return (
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
        {/* Gradients */}
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Horizontal gridlines */}
        {[0, 0.5, 1].map((ratio, i) => {
          const y = padding + (chartHeight - padding * 2) * ratio;
          return (
            <line 
              key={i} 
              x1={padding} 
              y1={y} 
              x2={chartWidth - padding} 
              y2={y} 
              stroke="#1e293b" 
              strokeWidth="1" 
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Draw Bars */}
        {data.map((d, index) => {
          const x = padding + index * stepX;
          const barHeight = (d.count / maxVal) * (chartHeight - padding * 2);
          const y = chartHeight - padding - barHeight;
          const barWidth = 14;

          return (
            <g key={index} className="group">
              {/* Animated/Glowing Bar */}
              <rect
                x={x - barWidth / 2}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="4"
                fill="url(#barGrad)"
                className="transition-all duration-200 hover:fill-purple-400 cursor-pointer"
              />
              
              {/* Hover Value Tooltip */}
              <text
                x={x}
                y={y - 6}
                textAnchor="middle"
                fill="#c084fc"
                fontSize="9"
                fontWeight="bold"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
              >
                {d.count}
              </text>
              
              {/* Date Label */}
              <text
                x={x}
                y={chartHeight - 4}
                textAnchor="middle"
                fill="#64748b"
                fontSize="9"
              >
                {d.date}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // Render SVG Line Chart for Daily Scans
  const renderScansChart = () => {
    const data = stats.daily_scans || [];
    if (data.length === 0) return null;

    const maxVal = Math.max(...data.map(d => d.count), 5);
    const stepX = (chartWidth - padding * 2) / (data.length - 1 || 1);
    
    // Build path coordinates
    const points = data.map((d, index) => {
      const x = padding + index * stepX;
      const y = chartHeight - padding - (d.count / maxVal) * (chartHeight - padding * 2);
      return { x, y };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = points.length > 0 
      ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`
      : '';

    return (
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Gridlines */}
        {[0, 0.5, 1].map((ratio, i) => {
          const y = padding + (chartHeight - padding * 2) * ratio;
          return (
            <line 
              key={i} 
              x1={padding} 
              y1={y} 
              x2={chartWidth - padding} 
              y2={y} 
              stroke="#1e293b" 
              strokeWidth="1" 
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Filled Area */}
        {areaPath && <path d={areaPath} fill="url(#areaGrad)" />}

        {/* Line */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Data Circles */}
        {points.map((p, index) => (
          <g key={index} className="group">
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#1e293b"
              stroke="#3b82f6"
              strokeWidth="2"
              className="cursor-pointer hover:r-6 transition-all"
            />
            {/* Tooltip value */}
            <text
              x={p.x}
              y={p.y - 8}
              textAnchor="middle"
              fill="#60a5fa"
              fontSize="9"
              fontWeight="bold"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            >
              {data[index].count}
            </text>
            <text
              x={p.x}
              y={chartHeight - 4}
              textAnchor="middle"
              fill="#64748b"
              fontSize="9"
            >
              {data[index].date}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      
      {/* Header and refresh */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 border-b border-gray-900 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Platform Dashboard</h1>
          <p className="text-xs text-gray-400 mt-1">Aggregated statistics across college registration event.</p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-gray-800 text-xs text-gray-300 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* STATS METRIC GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        
        {/* Metric 1 */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Users</span>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-white">{stats.total_users}</p>
          <p className="text-[10px] text-gray-500 mt-1">Active digital business cards</p>
        </div>

        {/* Metric 2 */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Profile Views</span>
            <Eye className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-white">{stats.total_views}</p>
          <p className="text-[10px] text-gray-500 mt-1">Total public online visits</p>
        </div>

        {/* Metric 3 */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">QR Scans</span>
            <QrCode className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-white">{stats.total_scans}</p>
          <p className="text-[10px] text-gray-500 mt-1">Interactive scanned leads</p>
        </div>

        {/* Metric 4 */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Asset Downloads</span>
            <Download className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-white">{stats.total_downloads}</p>
          <p className="text-[10px] text-gray-500 mt-1">PDF, PNG and VCF exports</p>
        </div>

      </div>

      {/* CHARTS CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10">
        
        {/* Registrations Chart */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800/80">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span>Daily Registrations (7 Days)</span>
          </h3>
          <div className="w-full h-44 flex items-center justify-center bg-slate-950/40 rounded-xl p-4 border border-slate-900">
            {renderRegistrationsChart()}
          </div>
        </div>

        {/* Scans Chart */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800/80">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span>Daily Scans (7 Days)</span>
          </h3>
          <div className="w-full h-44 flex items-center justify-center bg-slate-950/40 rounded-xl p-4 border border-slate-900">
            {renderScansChart()}
          </div>
        </div>

      </div>

      {/* MOST VIEWED PROFILES LIST */}
      <div className="rounded-2xl glass-panel border border-slate-800/80 p-6 md:p-8">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <Award className="w-4.5 h-4.5 text-amber-400" />
          <span>Top Profile Leaderboard</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-gray-500 font-bold uppercase tracking-wider">
                <th className="pb-4">Name</th>
                <th className="pb-4">Company & Role</th>
                <th className="pb-4 text-center">Views</th>
                <th className="pb-4 text-center">Scans</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.top_profiles && stats.top_profiles.length > 0 ? (
                stats.top_profiles.map((profile, i) => (
                  <tr key={i} className="border-b border-slate-900 hover:bg-slate-900/10 transition-colors">
                    <td className="py-4 font-bold text-white">{profile.name}</td>
                    <td className="py-4 text-gray-400">
                      <div>{profile.designation}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{profile.company}</div>
                    </td>
                    <td className="py-4 text-center text-blue-400 font-semibold">{profile.views}</td>
                    <td className="py-4 text-center text-amber-400 font-semibold">{profile.scans}</td>
                    <td className="py-4 text-right">
                      <a
                        href={`/u/${profile.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-gray-300 hover:text-white border border-gray-800 hover:border-gray-700 transition-colors"
                      >
                        Visit
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No registrations recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
