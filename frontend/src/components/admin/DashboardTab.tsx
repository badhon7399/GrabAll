'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface RevenueDataPoint {
  label: string;
  value: number;
}

interface CategoryDistPoint {
  name: string;
  count: number;
  percentage: number;
}

interface DashboardTabProps {
  totalSales: number;
  ordersCount: number;
  productsCount: number;
  lowStockCount: number;
  revenueData: RevenueDataPoint[];
  categoryDistribution: CategoryDistPoint[];
}

// ── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <>{prefix}{display.toLocaleString()}{suffix}</>;
}

// ── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({ segments }: { segments: { value: number; color: string; label: string }[] }) {
  const total = segments.reduce((a, b) => a + b.value, 0) || 1;
  const r = 52, cx = 64, cy = 64, strokeWidth = 10;
  const circ = 2 * Math.PI * r;

  const segmentOffsets = segments.reduce<number[]>((acc, _, i) => {
    return i === 0 ? [0] : [...acc, acc[i - 1] + segments[i - 1].value];
  }, []);

  return (
    <svg viewBox="0 0 128 128" className="w-40 h-40 relative z-10">
      <circle cx={cx} cy={cy} r={r} fill="none" className="stroke-slate-800/40 dark:stroke-slate-800" strokeWidth={strokeWidth} />
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dash = pct * circ;
        const gap = circ - dash;
        const rotate = (segmentOffsets[i] / total) * 360 - 90;
        return (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${gap}`}
            strokeLinecap="round"
            transform={`rotate(${rotate} ${cx} ${cy})`}
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${dash} ${gap}` }}
            transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
          />
        );
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" className="fill-slate-500 text-[8px] tracking-[0.1em] uppercase font-bold">Total Sales</text>
      <text x={cx} y={cy + 10} textAnchor="middle" className="fill-slate-900 dark:fill-white text-[11px] font-black" fontFamily="sans-serif">
        {total >= 1000 ? `$${(total / 1000).toFixed(1)}k` : `$${total}`}
      </text>
    </svg>
  );
}

// ── Half Gauge Chart ─────────────────────────────────────────────────────────
function HalfGauge({ percentage, color }: { percentage: number; color: string }) {
  const r = 44, strokeWidth = 9;
  const circ = Math.PI * r; // half circle circumference
  const strokeDashoffset = circ - (Math.min(percentage, 100) / 100) * circ;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg viewBox="0 0 120 70" className="w-36 h-20">
        {/* Background Arc */}
        <path
          d="M 16 60 A 44 44 0 0 1 104 60"
          fill="none"
          className="stroke-slate-800/40 dark:stroke-slate-800"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress Arc */}
        <motion.path
          d="M 16 60 A 44 44 0 0 1 104 60"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute bottom-2 flex flex-col items-center">
        <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{percentage}%</span>
        <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-1">+8.03% vs Last Month</span>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function DashboardTab({
  totalSales,
  ordersCount,
  productsCount,
  lowStockCount,
  revenueData,
  categoryDistribution,
}: DashboardTabProps) {
  const [activeRange, setActiveRange] = useState<'8 Days' | 'Month' | 'Year'>('8 Days');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const chartHeight = 160;
  const chartWidth = 500;
  
  // Custom mock values to fit the user's dashboard image
  const totalVisitorsVal = 237782;
  const monthlyTargetPercentage = 85;

  const maxRevenue = Math.max(...revenueData.map((d) => d.value), 1);
  const points = revenueData.map((d, i) => ({
    x: (i / Math.max(revenueData.length - 1, 1)) * chartWidth,
    y: chartHeight - (d.value / maxRevenue) * (chartHeight - 30) + 15,
    ...d,
  }));

  const smoothPath = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    const prev = points[i - 1];
    const cpx = (prev.x + p.x) / 2;
    return `${acc} C ${cpx},${prev.y} ${cpx},${p.y} ${p.x},${p.y}`;
  }, '');

  const areaPath = points.length > 1
    ? `${smoothPath} L ${points[points.length - 1].x},${chartHeight + 20} L ${points[0].x},${chartHeight + 20} Z`
    : '';

  const dashboardColors = {
    primary: '#0088FF', // Blue instead of Orange
    secondary: '#6366F1', // Indigo
    accent: '#8B5CF6', // Purple
    success: '#10B981', // Emerald
    warning: '#F59E0B', // Amber
    error: '#EF4444', // Red
  };

  const donutSegments = categoryDistribution.slice(0, 4).map((c, i) => ({
    value: c.count * 12500, // scaled for realistic dashboard numbers
    label: c.name,
    color: [dashboardColors.primary, dashboardColors.secondary, dashboardColors.accent, dashboardColors.success][i] ?? '#94a3b8',
  }));

  const conversionFunnel = [
    { label: 'Product Views', value: 25000, percentage: 100, change: '+9%' },
    { label: 'Add to Cart', value: 12000, percentage: 48, change: '+5%' },
    { label: 'Proceed to Checkout', value: 8500, percentage: 34, change: '+4%' },
    { label: 'Completed Purchases', value: 6200, percentage: 24.8, change: '+7%' },
    { label: 'Abandoned Carts', value: 3000, percentage: 12, change: '-5%' },
  ];

  const trafficSources = [
    { label: 'Direct Traffic', value: 40, color: dashboardColors.primary },
    { label: 'Organic Search', value: 30, color: '#38BDF8' },
    { label: 'Social Media', value: 15, color: dashboardColors.secondary },
    { label: 'Referral Traffic', value: 10, color: dashboardColors.accent },
    { label: 'Email Campaigns', value: 5, color: dashboardColors.success },
  ];

  const activeUsersByCountry = [
    { country: 'Bangladesh', percentage: 38, count: 1048 },
    { country: 'United States', percentage: 24, count: 662 },
    { country: 'United Kingdom', percentage: 18, count: 496 },
    { country: 'Other Countries', percentage: 20, count: 552 },
  ];

  return (
    <div className="space-y-6 pb-8 select-none">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Dashboard</h2>
          <p className="text-slate-500 text-xs mt-0.5">Welcome back, Admin</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">search</span>
            <input
              type="text"
              placeholder="Search stock, order, etc..."
              className="pl-8 pr-4 py-2 w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ── Top Row: 3 KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total Sales */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-500">
              <span className="material-symbols-outlined text-lg">attach_money</span>
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
            BDT <AnimatedCounter value={totalSales} />
          </h3>
          <div className="flex items-center gap-1 text-[10px] font-mono mt-2">
            <span className="text-emerald-500 font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              +3.34%
            </span>
            <span className="text-slate-400">vs last week</span>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-500">
              <span className="material-symbols-outlined text-lg">shopping_bag</span>
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
            <AnimatedCounter value={ordersCount} />
          </h3>
          <div className="flex items-center gap-1 text-[10px] font-mono mt-2">
            <span className="text-rose-500 font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-xs">trending_down</span>
              -2.89%
            </span>
            <span className="text-slate-400">vs last week</span>
          </div>
        </div>

        {/* Card 3: Total Visitors */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Visitors</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-500">
              <span className="material-symbols-outlined text-lg">visibility</span>
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
            <AnimatedCounter value={totalVisitorsVal} />
          </h3>
          <div className="flex items-center gap-1 text-[10px] font-mono mt-2">
            <span className="text-emerald-500 font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              +6.02%
            </span>
            <span className="text-slate-400">vs last week</span>
          </div>
        </div>
      </div>

      {/* ── Middle Row: Revenue Analytics + Monthly Target + Top Categories ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column (Span 2): Revenue Analytics */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-950 dark:text-white">Revenue Analytics</h4>
              <p className="text-[10px] text-slate-400">Cumulative sales performance trends</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              {(['8 Days', 'Month', 'Year'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRange(r)}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                    activeRange === r
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex-1 flex flex-col justify-center min-h-[170px]">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="revenueBlueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={dashboardColors.primary} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={dashboardColors.primary} stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => (
                <line
                  key={idx}
                  x1="0"
                  y1={15 + r * (chartHeight - 30)}
                  x2={chartWidth}
                  y2={15 + r * (chartHeight - 30)}
                  className="stroke-slate-100 dark:stroke-slate-800"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}
              {/* Area path */}
              {areaPath && <path d={areaPath} fill="url(#revenueBlueGrad)" />}
              {/* Smooth line */}
              {smoothPath && (
                <motion.path
                  d={smoothPath}
                  fill="none"
                  stroke={dashboardColors.primary}
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                />
              )}
              {/* Interactive Points */}
              {points.map((p, idx) => (
                <g
                  key={idx}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(idx)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <circle cx={p.x} cy={p.y} r="12" fill="transparent" />
                  <motion.circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint === idx ? 6 : 4}
                    fill={dashboardColors.primary}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="dark:stroke-slate-900"
                    animate={{ r: hoveredPoint === idx ? 6 : 4 }}
                  />
                  <AnimatePresence>
                    {hoveredPoint === idx && (
                      <motion.foreignObject
                        x={p.x - 50}
                        y={p.y - 36}
                        width="100"
                        height="30"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="bg-slate-900 text-white font-mono text-[9px] font-bold py-1 px-1.5 rounded-lg text-center shadow-lg border border-slate-700">
                          {p.value.toLocaleString()} BDT
                        </div>
                      </motion.foreignObject>
                    )}
                  </AnimatePresence>
                </g>
              ))}
            </svg>
            <div className="flex justify-between mt-2 px-1">
              {revenueData.map((d, i) => (
                <span key={i} className="text-[9px] text-slate-400 font-mono">{d.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Monthly Target */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-sm font-bold text-slate-950 dark:text-white">Monthly Target</h4>
              <p className="text-[10px] text-slate-400">Core sales metrics target</p>
            </div>
            <button className="material-symbols-outlined text-slate-400 hover:text-slate-600 text-lg">more_horiz</button>
          </div>

          <div className="my-2 flex justify-center">
            <HalfGauge percentage={monthlyTargetPercentage} color={dashboardColors.primary} />
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Target</span>
              <span className="text-xs font-mono font-black text-slate-900 dark:text-white">600,000 BDT</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Revenue</span>
              <span className="text-xs font-mono font-black text-slate-900 dark:text-white">
                {(totalSales * 0.85).toLocaleString(undefined, { maximumFractionDigits: 0 })} BDT
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Top Categories */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-sm font-bold text-slate-950 dark:text-white">Top Categories</h4>
              <p className="text-[10px] text-slate-400 font-mono">Sales share by classification</p>
            </div>
            <button className="text-[10px] font-bold text-blue-500 hover:underline">See All</button>
          </div>

          <div className="flex justify-center my-3 relative">
            <DonutChart segments={donutSegments.length > 0 ? donutSegments : [{ value: 1, color: '#e2e8f0', label: 'None' }]} />
          </div>

          <div className="space-y-1.5 text-[10px] font-mono pt-2 border-t border-slate-100 dark:border-slate-800">
            {donutSegments.slice(0, 4).map((seg, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                  <span className="text-slate-600 dark:text-slate-300 truncate">{seg.label}</span>
                </div>
                <span className="text-slate-900 dark:text-white font-bold ml-2">
                  BDT {seg.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Active User + Conversion Rate + Traffic Sources ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Active Users */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-sm font-bold text-slate-950 dark:text-white">Active User</h4>
              <p className="text-[10px] text-slate-400">Live active sessions distribution</p>
            </div>
            <button className="material-symbols-outlined text-slate-400 hover:text-slate-600 text-lg">more_horiz</button>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">2,758</span>
              <span className="text-[10px] font-bold text-emerald-500 font-mono">+8.02% from last month</span>
            </div>
          </div>

          <div className="space-y-3">
            {activeUsersByCountry.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-600 dark:text-slate-300 font-bold">{item.country}</span>
                  <span className="text-slate-900 dark:text-white font-black">{item.percentage}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    style={{
                      background: `linear-gradient(to right, ${dashboardColors.primary}, ${dashboardColors.secondary})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Conversion Rate Funnel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-sm font-bold text-slate-950 dark:text-white">Conversion Rate</h4>
              <p className="text-[10px] text-slate-400">Storefront checkout funnel statistics</p>
            </div>
            <span className="text-[9px] font-black font-mono text-white bg-blue-500 px-2 py-0.5 rounded-lg shadow-sm">
              This Week
            </span>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between h-40 pt-4 px-1">
            {conversionFunnel.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1 group">
                <div className="relative w-full flex flex-col items-center justify-end h-28">
                  {/* Tooltip on hover */}
                  <span className="absolute -top-5 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-white font-mono text-[8px] py-0.5 px-1 rounded shadow-md pointer-events-none z-20">
                    {item.value.toLocaleString()}
                  </span>
                  <motion.div
                    className="w-4/5 rounded-t-lg bg-blue-500/20 hover:bg-blue-500 transition-colors cursor-default"
                    initial={{ height: 0 }}
                    animate={{ height: `${item.percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.05 }}
                    style={{
                      backgroundColor: idx === 3 ? dashboardColors.primary : undefined,
                    }}
                  />
                </div>
                <span className="text-[8px] font-black text-slate-900 dark:text-slate-300 font-mono mt-1 text-center truncate w-14">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-between text-[7px] text-slate-400 font-mono tracking-tighter pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Views</span>
            <span>Cart</span>
            <span>Checkout</span>
            <span>Purchase</span>
            <span>Abandon</span>
          </div>
        </div>

        {/* Card 3: Traffic Sources */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-sm font-bold text-slate-950 dark:text-white">Traffic Sources</h4>
              <p className="text-[10px] text-slate-400 font-mono">Visitor referral channels</p>
            </div>
            <button className="material-symbols-outlined text-slate-400 hover:text-slate-600 text-lg">more_horiz</button>
          </div>

          {/* Stacked bar or distribution visualization */}
          <div className="h-6 bg-slate-100 dark:bg-slate-850 rounded-xl overflow-hidden flex my-4">
            {trafficSources.map((source, idx) => (
              <motion.div
                key={idx}
                className="h-full hover:brightness-110 transition-all cursor-pointer"
                style={{
                  width: `${source.value}%`,
                  backgroundColor: source.color,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                title={`${source.label}: ${source.value}%`}
              />
            ))}
          </div>

          <div className="space-y-2 font-mono text-[9px] pt-1">
            {trafficSources.map((source, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />
                  <span className="text-slate-500 dark:text-slate-450">{source.label}</span>
                </div>
                <span className="text-slate-900 dark:text-white font-black">{source.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer Status Bar ── */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[10px] font-mono text-slate-400 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-500 font-bold">All systems operational</span>
          </span>
          <span>Last sync: just now</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{productsCount} products cataloged {lowStockCount > 0 && <span className="text-amber-500 font-bold">(low stock: {lowStockCount})</span>}</span>
          <span>{ordersCount} orders tracked</span>
          <span className="text-blue-500 font-bold">v2.1.0</span>
        </div>
      </div>
    </div>
  );
}