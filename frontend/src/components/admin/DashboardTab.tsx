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
    const duration = 1200;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <>{prefix}{display.toLocaleString()}{suffix}</>;
}

// ── Sparkline Mini Chart ──────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 32;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * h,
  }));
  const line = pts.map(p => `${p.x},${p.y}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-20 h-8">
      <polyline points={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Donut Ring Chart ──────────────────────────────────────────────────────────
function DonutChart({ segments }: { segments: { value: number; color: string; label: string }[] }) {
  const total = segments.reduce((a, b) => a + b.value, 0) || 1;
  const r = 54, cx = 64, cy = 64, stroke = 12;
  const circ = 2 * Math.PI * r;
  
  // Precompute segment offsets using pure reduce to keep render loop pure
  const segmentOffsets = segments.reduce<number[]>((acc, _, i) => {
    return i === 0 ? [0] : [...acc, acc[i - 1] + segments[i - 1].value];
  }, []);

  return (
    <svg viewBox="0 0 128 128" className="w-32 h-32">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dash = pct * circ;
        const gap = circ - dash;
        const rotate = (segmentOffsets[i] / total) * 360 - 90;
        return (
          <motion.circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeLinecap="round"
            transform={`rotate(${rotate} ${cx} ${cy})`}
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${dash} ${gap}` }}
            transition={{ duration: 1, delay: i * 0.15, ease: 'easeOut' }} 
          />
      );
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" className="fill-slate-100 text-xs" fontSize="10" fontWeight="bold" fontFamily="monospace">TOTAL</text>
      <text x={cx} y={cy + 8} textAnchor="middle" className="fill-white" fontSize="13" fontWeight="900" fontFamily="monospace">{total === 1 && segments.length === 0 ? 0 : total}</text>
    </svg>
  );
}

// ── Gauge Chart ───────────────────────────────────────────────────────────────
function GaugeChart({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(value / max, 1);
  const r = 40, cx = 56, cy = 56;
  const startAngle = -210, endAngle = 30;
  const totalArc = endAngle - startAngle;
  const angle = startAngle + pct * totalArc;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcPath = (start: number, end: number, radius: number) => {
    const s = { x: cx + radius * Math.cos(toRad(start)), y: cy + radius * Math.sin(toRad(start)) };
    const e = { x: cx + radius * Math.cos(toRad(end)), y: cy + radius * Math.sin(toRad(end)) };
    const large = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
  };
  const needleX = cx + 32 * Math.cos(toRad(angle));
  const needleY = cy + 32 * Math.sin(toRad(angle));
  return (
    <svg viewBox="0 0 112 72" className="w-28 h-16">
      <path d={arcPath(startAngle, endAngle, r)} fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
      <motion.path
        d={arcPath(startAngle, endAngle, r)}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${pct * (totalArc / 360) * 2 * Math.PI * r} 999`}
        initial={{ strokeDasharray: `0 999` }}
        animate={{ strokeDasharray: `${pct * (totalArc / 360) * 2 * Math.PI * r} 999` }}
        transition={{ duration: 1.2, ease: 'easeOut' }} 
      />
      <motion.line
        x1={cx} y1={cy}
        x2={needleX} y2={needleY}
        stroke={color} strokeWidth="2" strokeLinecap="round"
        initial={{ rotate: -210, originX: `${cx}px`, originY: `${cy}px` }}
        animate={{ x2: needleX, y2: needleY }}
        transition={{ duration: 1.2, ease: 'easeOut' }} 
      />
      <circle cx={cx} cy={cy} r="4" fill={color} />
      <text x={cx} y={cy + 14} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="monospace">{Math.round(pct * 100)}%</text>
    </svg>
  );
}

// ── Recent Activity Feed ──────────────────────────────────────────────────────
const mockActivity = [
  { icon: 'add_shopping_cart', label: 'New order placed', sub: 'Order #4821 · BDT 3,200', time: '2m ago', color: '#10B981' },
  { icon: 'warning', label: 'Low stock alert', sub: 'Wireless Mouse · 3 left', time: '8m ago', color: '#EF4444' },
  { icon: 'inventory_2', label: 'Stock updated', sub: 'USB Hub +50 units', time: '22m ago', color: '#F59E0B' },
  { icon: 'payments', label: 'Payment received', sub: 'BDT 12,500 via bKash', time: '1h ago', color: '#0088FF' },
  { icon: 'local_shipping', label: 'Order shipped', sub: 'Order #4810 dispatched', time: '2h ago', color: '#8B5CF6' },
];

// ── Top Products Table ────────────────────────────────────────────────────────
const mockTopProducts = [
  { name: 'Mechanical Keyboard', sales: 142, revenue: 284000, trend: '+18%', up: true },
  { name: 'Wireless Mouse', sales: 98, revenue: 117600, trend: '+9%', up: true },
  { name: 'USB-C Hub', sales: 76, revenue: 60800, trend: '-3%', up: false },
  { name: 'Monitor Stand', sales: 54, revenue: 43200, trend: '+21%', up: true },
  { name: 'Headset Pro', sales: 43, revenue: 107500, trend: '+5%', up: true },
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function DashboardTab({
  totalSales,
  ordersCount,
  productsCount,
  lowStockCount,
  revenueData,
  categoryDistribution,
}: DashboardTabProps) {
  const [activeRange, setActiveRange] = useState<'1W' | '1M' | '3M'>('1M');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const chartHeight = 180;
  const chartWidth = 520;
  const maxRevenue = Math.max(...revenueData.map((d) => d.value), 1);

  const points = revenueData.map((d, i) => ({
    x: (i / Math.max(revenueData.length - 1, 1)) * chartWidth,
    y: chartHeight - (d.value / maxRevenue) * (chartHeight - 20) + 10,
    ...d,
  }));

  // Smooth cubic bezier path
  const smoothPath = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    const prev = points[i - 1];
    const cpx = (prev.x + p.x) / 2;
    return `${acc} C ${cpx},${prev.y} ${cpx},${p.y} ${p.x},${p.y}`;
  }, '');

  const areaPath = points.length > 1
    ? `${smoothPath} L ${points[points.length - 1].x},${chartHeight + 10} L ${points[0].x},${chartHeight + 10} Z`
    : '';

  const statCards = [
    {
      title: 'Gross Revenue',
      value: totalSales,
      display: `BDT ${totalSales.toLocaleString()}`,
      icon: 'payments',
      color: 'from-[#0088FF] to-[#0055CC]',
      accent: '#0088FF',
      spark: [40, 55, 45, 70, 60, 85, 75, 90],
      change: '+12.4%',
      up: true,
    },
    {
      title: 'Sales Volume',
      value: ordersCount,
      display: `${ordersCount}`,
      suffix: ' Orders',
      icon: 'shopping_basket',
      color: 'from-[#10B981] to-[#059669]',
      accent: '#10B981',
      spark: [30, 40, 35, 55, 45, 65, 60, 70],
      change: '+8.1%',
      up: true,
    },
    {
      title: 'Catalog Listings',
      value: productsCount,
      display: `${productsCount}`,
      suffix: ' Items',
      icon: 'inventory',
      color: 'from-[#F59E0B] to-[#D97706]',
      accent: '#F59E0B',
      spark: [60, 58, 62, 64, 60, 65, 63, 68],
      change: '+2.3%',
      up: true,
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockCount,
      display: `${lowStockCount}`,
      suffix: ' Warnings',
      icon: 'warning',
      color: 'from-[#EF4444] to-[#DC2626]',
      accent: '#EF4444',
      spark: [10, 8, 12, 15, 10, 18, 14, lowStockCount],
      change: lowStockCount > 0 ? 'Needs Action' : 'All Clear',
      up: false,
      alert: lowStockCount > 0,
    },
  ];

  const donutData = categoryDistribution.slice(0, 4).map((c, i) => ({
    value: c.count,
    label: c.name,
    color: ['#FF4B7E', '#0088FF', '#10B981', '#F59E0B'][i] ?? '#8B5CF6',
  }));

  return (
    <div className="space-y-8 pb-8">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      className="flex items-end justify-between"
      >
      <div>
        <p className="text-[10px] font-mono text-[#FF4B7E] tracking-[0.3em] uppercase mb-1">Analytics Suite v2</p>
        <h2 className="text-3xl font-black text-white tracking-tight">
          Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B7E] to-[#FF85A7]">Center</span>
        </h2>
        <p className="text-slate-500 text-xs mt-1 font-mono">Real-time telemetry · {new Date().toLocaleDateString('en-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </span>
        <button className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm">download</span>
          Export
        </button>
      </div>
    </motion.div>

      {/* ── KPI Cards ── */ }
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
    {statCards.map((stat, i) => (
      <motion.div
        key={stat.title}
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: i * 0.07, type: 'spring', stiffness: 260, damping: 22 }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="relative bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-hidden cursor-default group"
    style={{ boxShadow: `0 0 30px ${stat.accent}12` }}
          >
    {/* glow orb */}
    <div
      className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"
      style={{ background: stat.accent }}
    />

    {/* alert ping */}
    {stat.alert && (
      <span className="absolute top-3.5 right-3.5 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
      </span>
    )}

    {/* top row */}
    <div className="flex justify-between items-start mb-3">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono leading-tight">{stat.title}</p>
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
        <span className="material-symbols-outlined text-base text-white">{stat.icon}</span>
      </div>
    </div>

    {/* value */}
    <h3 className="text-[1.6rem] font-black text-white tracking-tight leading-none">
      <AnimatedCounter value={stat.value} />
      {stat.suffix && <span className="text-sm font-bold text-slate-400 ml-1">{stat.suffix}</span>}
    </h3>

    {/* sparkline + change */}
    <div className="flex items-end justify-between mt-3">
      <div className="flex items-center gap-1 text-[10px] font-mono">
        <span className={`material-symbols-outlined text-xs font-bold ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
          {stat.up ? 'trending_up' : 'trending_down'}
        </span>
        <span className={stat.up ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>{stat.change}</span>
        <span className="text-slate-600">/ mo</span>
      </div>
      <Sparkline data={stat.spark} color={stat.accent} />
    </div>

    {/* bottom accent bar */}
    <motion.div
      className="absolute bottom-0 left-0 h-[2px] rounded-b-2xl"
      style={{ background: `linear-gradient(to right, ${stat.accent}, transparent)` }}
      initial={{ width: 0 }}
      animate={{ width: '100%' }}
      transition={{ delay: i * 0.07 + 0.4, duration: 0.8, ease: 'easeOut' }} 
            />
  </motion.div>
        ))
}
      </div >

  {/* ── Middle Row: Revenue Chart + Activity Feed ── */ }
  < div className = "grid grid-cols-1 lg:grid-cols-3 gap-6" >

    {/* Revenue Chart */ }
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
className = "lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col"
  >
  <div className="flex justify-between items-start mb-5">
    <div>
      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Revenue Performance</h3>
      <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Cumulative sales revenue over selected period</p>
    </div>
    <div className="flex gap-1.5 bg-slate-800/60 rounded-xl p-1">
      {(['1W', '1M', '3M'] as const).map(r => (
        <button
          key={r}
          onClick={() => setActiveRange(r)}
          className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${activeRange === r
              ? 'bg-[#FF4B7E] text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
            }`}
        >
          {r}
        </button>
      ))}
    </div>
  </div>

{/* Y-axis labels + chart */ }
<div className="flex gap-3 flex-1 min-h-[200px]">
  <div className="flex flex-col justify-between pb-8 text-[9px] text-slate-600 font-mono text-right w-12">
    {[1, 0.75, 0.5, 0.25, 0].map(r => (
      <span key={r}>{(maxRevenue * r / 1000).toFixed(0)}k</span>
    ))}
  </div>
  <div className="flex-1 flex flex-col">
    <div className="flex-1 relative">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF4B7E" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FF4B7E" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Horizontal grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => (
          <line key={idx} x1="0" y1={10 + r * (chartHeight - 20)} x2={chartWidth} y2={10 + r * (chartHeight - 20)}
            stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
        ))}
        {/* Area */}
        {areaPath && <path d={areaPath} fill="url(#revGrad)" />}
        {/* Line */}
        {smoothPath && (
          <motion.path
            d={smoothPath}
            fill="none"
            stroke="#FF4B7E"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }} 
                    />
                  )}
        {/* Points */}
        {points.map((p, idx) => (
          <g key={idx}
            className="cursor-pointer"
            onMouseEnter={() => setHoveredPoint(idx)}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <circle cx={p.x} cy={p.y} r="10" fill="transparent" />
            <motion.circle
              cx={p.x} cy={p.y}
              r={hoveredPoint === idx ? 6 : 4}
              fill="#FF4B7E"
              stroke="#0f172a"
              strokeWidth="2"
              animate={{ r: hoveredPoint === idx ? 6 : 4 }}
              transition={{ duration: 0.15 }} 
                      />
            <AnimatePresence>
              {hoveredPoint === idx && (
                <motion.foreignObject
                  x={p.x - 44} y={p.y - 38}
                  width="88" height="28"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} 
                          >
              <div className="bg-slate-950 border border-[#FF4B7E]/40 text-white font-mono text-[9px] font-bold py-1 px-2 rounded-lg text-center shadow-xl">
                {Math.round(p.value).toLocaleString()} BDT
              </div>
            </motion.foreignObject>
                        )}
          </AnimatePresence>
                    </g>
                  ))}
    </svg>
  </div>
  {/* X labels */}
  <div className="flex justify-between mt-1 px-1">
    {revenueData.map((d, i) => (
      <span key={i} className="text-[10px] text-slate-600 font-mono">{d.label}</span>
    ))}
  </div>
</div>
          </div >
        </motion.div >

  {/* Activity Feed */ }
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
className = "bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col"
  >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Live Activity</h3>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">Recent workspace events</p>
            </div>
            <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
          </div>
          <div className="space-y-3 flex-1">
            {mockActivity.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }} 
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/40 hover:border-slate-600/60 transition-colors group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}
                >
                  <span className="material-symbols-outlined text-sm" style={{ color: item.color }}>{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate">{item.label}</p>
                  <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">{item.sub}</p>
                </div>
                <span className="text-[9px] text-slate-600 font-mono flex-shrink-0 mt-0.5">{item.time}</span>
              </motion.div >
            ))}
          </div >
  <button className="mt-4 w-full py-2 rounded-xl border border-slate-700 text-[11px] font-mono font-bold text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors">
    View All Events →
  </button>
        </motion.div >
      </div >

  {/* ── Bottom Row: Category Donut + Gauges + Top Products ── */ }
  < div className = "grid grid-cols-1 lg:grid-cols-3 gap-6" >

    {/* Category Donut */ }
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
className = "bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col"
  >
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-1">Inventory Clusters</h3>
          <p className="text-[10px] text-slate-500 font-mono mb-5">Category distribution by stock volume</p>

          <div className="flex items-center justify-center mb-5">
            <DonutChart segments={donutData.length > 0 ? donutData : [{ value: 1, color: '#1e293b', label: 'Empty' }]} />
          </div>

          <div className="space-y-3">
            {categoryDistribution.slice(0, 5).map((cat, i) => {
              const colors = ['#FF4B7E', '#0088FF', '#10B981', '#F59E0B', '#8B5CF6'];
              const color = colors[i] ?? '#64748b';
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-300 font-bold truncate max-w-[120px]">{cat.name}</span>
                    <span className="text-slate-400">{cat.percentage}% · {cat.count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percentage}%` }}
                      transition={{ duration: 0.9, delay: 0.6 + i * 0.1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div >

  {/* Performance Gauges */ }
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.55 }}
className = "bg-slate-900 border border-slate-800 rounded-2xl p-6"
  >
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-1">Performance Gauges</h3>
          <p className="text-[10px] text-slate-500 font-mono mb-6">Operational health vs targets</p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Revenue', value: totalSales, max: totalSales * 1.5, color: '#0088FF' },
              { label: 'Orders', value: ordersCount, max: 200, color: '#10B981' },
              { label: 'Stock', value: Math.max(productsCount - lowStockCount, 0), max: productsCount, color: '#F59E0B' },
              { label: 'Fulfillment', value: ordersCount - lowStockCount, max: ordersCount, color: '#FF4B7E' },
            ].map((g, i) => (
              <motion.div
                key={g.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }} 
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700/40"
              >
                <GaugeChart value={g.value} max={g.max} color={g.color} />
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{g.label}</span>
              </motion.div>
            ))}
          </div >
        </motion.div >

  {/* Top Products */ }
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
className = "bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col"
  >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Top Products</h3>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">By revenue this month</p>
            </div>
            <button className="text-[10px] font-mono text-[#FF4B7E] hover:underline">See all →</button>
          </div>

          <div className="space-y-2 flex-1">
            {mockTopProducts.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 + i * 0.07 }} 
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 transition-colors group cursor-default"
              >
                <div className="w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-300 font-mono flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate">{p.name}</p>
                  <p className="text-[9px] font-mono text-slate-500 mt-0.5">{p.sales} sold · BDT {p.revenue.toLocaleString()}</p>
                </div>
                <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-lg ${
                  p.up
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {p.trend}
                </span>
              </motion.div>
            ))}
          </div >
        </motion.div >
      </div >

  {/* ── Footer Status Bar ── */ }
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.9 }}
className = "flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-600"
  >
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400">All systems operational</span>
          </span>
          <span>Last sync: just now</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{productsCount} products indexed</span>
          <span>{ordersCount} orders tracked</span>
          <span className="text-[#FF4B7E] font-bold">v2.0.0</span>
        </div>
      </motion.div >

    </div >
  );
}