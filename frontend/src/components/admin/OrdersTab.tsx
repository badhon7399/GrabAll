'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Order } from '../../types';

interface OrdersTabProps {
  orders: Order[];
  onUpdateOrderStatus: (id: string, updates: { status?: string; paymentStatus?: string }) => Promise<void>;
  onDeleteOrder: (id: string) => Promise<void>;
}

// ── Status Config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; icon: string; dot: string }> = {
  DELIVERED: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'check_circle', dot: 'bg-emerald-400' },
  SHIPPED: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'local_shipping', dot: 'bg-blue-400' },
  PROCESSING: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: 'autorenew', dot: 'bg-amber-400' },
  PENDING: { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: 'schedule', dot: 'bg-slate-400' },
};

const PAYMENT_CONFIG: Record<string, { color: string; bg: string; border: string; icon: string }> = {
  PAID: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'verified' },
  REFUNDED: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'currency_exchange' },
  PENDING: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: 'pending' },
};

const getStatus = (s: string) => STATUS_CONFIG[s?.toUpperCase()] ?? STATUS_CONFIG.PENDING;
const getPayment = (s: string) => PAYMENT_CONFIG[s?.toUpperCase()] ?? PAYMENT_CONFIG.PENDING;

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ label, type = 'order' }: { label: string; type?: 'order' | 'payment' }) {
  const cfg = type === 'payment' ? getPayment(label) : getStatus(label);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono tracking-wider uppercase border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      <span className="material-symbols-outlined text-[11px]">{cfg.icon}</span>
      {label}
    </span>
  );
}

// ── Mini Order Timeline ───────────────────────────────────────────────────────
function OrderTimeline({ status }: { status: string }) {
  const steps = ['PROCESSING', 'SHIPPED', 'DELIVERED'];
  const currentIdx = steps.indexOf(status.toUpperCase());
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        const cfg = getStatus(step);
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${done
                ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                : 'bg-slate-800 border-slate-700 text-slate-600'
                } ${active ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-current' : ''}`}
              >
              <span className="material-symbols-outlined text-[13px]">{done ? cfg.icon : 'circle'}</span>
            </motion.div>
            <span className={`text-[8px] font-mono font-bold ${done ? cfg.color : 'text-slate-600'}`}>{step.slice(0, 4)}</span>
          </div>
            {
          i < steps.length - 1 && (
            <div className={`w-10 h-[2px] mb-4 mx-1 rounded-full transition-all ${i < currentIdx ? 'bg-emerald-500/60' : 'bg-slate-800'}`} />
          )
        }
          </div>
  );
})}
    </div >
  );
}

// ── Confirm Delete Dialog ─────────────────────────────────────────────────────
function ConfirmDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onCancel} />
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
  className = "relative bg-slate-900 border border-red-900/30 rounded-2xl p-6 w-80 shadow-2xl"
    >
    <div className="flex flex-col items-center text-center gap-4">
      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <span className="material-symbols-outlined text-red-400 text-2xl">delete_forever</span>
      </div>
      <div>
        <h4 className="font-black text-white text-sm font-mono uppercase tracking-wide">Delete Order Log?</h4>
        <p className="text-slate-500 text-xs mt-1 font-mono leading-relaxed">This action is irreversible. Customer purchase history will be permanently erased.</p>
      </div>
      <div className="flex gap-3 w-full">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold font-mono hover:bg-slate-750 transition-colors"
        >
          CANCEL
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold font-mono hover:bg-red-500/30 transition-colors"
        >
          DELETE
        </button>
      </div>
    </div>
      </motion.div >
    </motion.div >
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function OrdersTab({ orders, onUpdateOrderStatus, onDeleteOrder }: OrdersTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'items' | 'history'>('details');

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getClientName = (o: Order) => o.guestDetails?.name ?? (o.user as { name?: string; email?: string })?.name ?? 'Registered User';
  const getClientEmail = (o: Order) => o.guestDetails?.email ?? (o.user as { name?: string; email?: string })?.email ?? '—';
  const getClientPhone = (o: Order) => o.guestDetails?.phone ?? 'N/A';

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = orders.reduce((a, o) => a + o.totalAmount, 0);
    const delivered = orders.filter(o => o.orderStatus.toUpperCase() === 'DELIVERED').length;
    const pending = orders.filter(o => o.paymentStatus.toUpperCase() === 'PENDING').length;
    const processing = orders.filter(o => o.orderStatus.toUpperCase() === 'PROCESSING').length;
    return { total, delivered, pending, processing };
  }, [orders]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleStatusChange = async (id: string, updates: { status?: string; paymentStatus?: string }) => {
    setUpdatingId(id);
    try {
      await onUpdateOrderStatus(id, updates);
      if (selectedOrder?._id === id) {
        setSelectedOrder(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    try {
      await onDeleteOrder(selectedOrder._id);
      setSelectedOrder(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSort = (col: 'date' | 'amount') => {
    if (sortBy === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  // ── Filtered & Sorted Orders ───────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return orders
      .filter(o => {
        const matchSearch = o._id.toLowerCase().includes(term)
          || getClientName(o).toLowerCase().includes(term)
          || getClientEmail(o).toLowerCase().includes(term);
        const matchStatus = statusFilter === 'ALL' || o.orderStatus.toUpperCase() === statusFilter;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => {
        const dir = sortDir === 'desc' ? -1 : 1;
        if (sortBy === 'amount') return dir * (a.totalAmount - b.totalAmount);
        return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      });
  }, [orders, searchTerm, statusFilter, sortBy, sortDir]);

  // ── Status filter counts ───────────────────────────────────────────────────
  const filterCounts: Record<string, number> = useMemo(() => ({
    ALL: orders.length,
    PROCESSING: orders.filter(o => o.orderStatus.toUpperCase() === 'PROCESSING').length,
    SHIPPED: orders.filter(o => o.orderStatus.toUpperCase() === 'SHIPPED').length,
    DELIVERED: orders.filter(o => o.orderStatus.toUpperCase() === 'DELIVERED').length,
  }), [orders]);

  return (
    <div className="space-y-7 pb-8">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      className="flex items-end justify-between"
      >
      <div>
        <p className="text-[10px] font-mono text-[#0088FF] tracking-[0.3em] uppercase mb-1">Order Management</p>
        <h2 className="text-3xl font-black text-white tracking-tight">
          Orders <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0088FF] to-[#3B82F6]">Ledger</span>
        </h2>
        <p className="text-slate-500 text-xs mt-1 font-mono">Audit invoices · track shipments · manage statuses</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-300 hover:bg-slate-700 transition-colors">
          <span className="material-symbols-outlined text-sm">download</span>
          Export CSV
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0088FF] text-xs font-mono font-bold text-white hover:bg-[#0077ee] transition-colors shadow-lg shadow-[#0088FF]/20">
          <span className="material-symbols-outlined text-sm">print</span>
          Print
        </button>
      </div>
    </motion.div>

      {/* ── Mini Stats Row ── */ }
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `BDT ${stats.total.toLocaleString()}`, icon: 'account_balance_wallet', color: '#0088FF' },
          { label: 'Delivered', value: `${stats.delivered} Orders`, icon: 'check_circle', color: '#10B981' },
          { label: 'Processing', value: `${stats.processing} Active`, icon: 'autorenew', color: '#F59E0B' },
          { label: 'Unpaid', value: `${stats.pending} Pending`, icon: 'pending', color: '#EF4444' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3.5 flex items-center gap-3"
            style={{ boxShadow: `0 0 20px ${s.color}08` }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
              <span className="material-symbols-outlined text-base" style={{ color: s.color }}>{s.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{s.label}</p>
              <p className="text-sm font-black text-white truncate">{s.value}</p>
            </div>
          </motion.div >
        ))
}
      </div >

  {/* ── Table Panel ── */ }
  < motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
className = "bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
  >
  {/* Toolbar */ }
  < div className = "p-5 border-b border-slate-800 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between" >
    {/* Search */ }
    < div className = "relative flex-1 max-w-sm" >
            <span className="material-symbols-outlined text-slate-500 text-base absolute left-3.5 top-1/2 -translate-y-1/2">search</span>
            <input
              type="text"
              placeholder="Search by order ID, name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-slate-200 text-xs font-mono placeholder-slate-600 focus:border-[#0088FF]/40 focus:bg-slate-800 focus:outline-none transition-all"
            />
            <AnimatePresence>
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </motion.button>
              )}
            </AnimatePresence >
          </div >

  {/* Status Filters */ }
  < div className = "flex gap-1.5 bg-slate-800/60 rounded-xl p-1" >
    {(['ALL', 'PROCESSING', 'SHIPPED', 'DELIVERED'] as const).map((st) => {
      const cfg = st !== 'ALL' ? getStatus(st) : null;
      return (
        <button
          key={st}
          onClick={() => setStatusFilter(st)}
          className={`relative px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${statusFilter === st
            ? 'bg-slate-700 text-white shadow-sm'
            : 'text-slate-500 hover:text-slate-300'
            }`}
        >
          {cfg && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
          {st}
          <span className={`text-[9px] px-1 rounded ${statusFilter === st ? 'bg-slate-600 text-slate-200' : 'bg-slate-700/50 text-slate-500'}`}>
            {filterCounts[st]}
          </span>
        </button>
      );
    })}
          </div >
        </div >

  {/* Table */ }
  < div className = "overflow-x-auto" >
    <table className="w-full text-left">
      <thead>
        <tr className="bg-slate-800/30 text-[9px] font-bold text-slate-500 font-mono tracking-[0.15em] uppercase">
          <th className="py-3 px-5">Order</th>
          <th
            className="py-3 px-4 cursor-pointer hover:text-slate-300 transition-colors select-none"
            onClick={() => toggleSort('date')}
          >
            <span className="flex items-center gap-1">
              Date
              <span className="material-symbols-outlined text-[11px]">
                {sortBy === 'date' ? (sortDir === 'desc' ? 'arrow_downward' : 'arrow_upward') : 'unfold_more'}
              </span>
            </span>
          </th>
          <th className="py-3 px-4">Client</th>
          <th
            className="py-3 px-4 cursor-pointer hover:text-slate-300 transition-colors select-none"
            onClick={() => toggleSort('amount')}
          >
            <span className="flex items-center gap-1">
              Amount
              <span className="material-symbols-outlined text-[11px]">
                {sortBy === 'amount' ? (sortDir === 'desc' ? 'arrow_downward' : 'arrow_upward') : 'unfold_more'}
              </span>
            </span>
          </th>
          <th className="py-3 px-4">Shipment</th>
          <th className="py-3 px-4">Payment</th>
          <th className="py-3 px-5 text-right">Action</th>
        </tr>
      </thead>
      <tbody>
        <AnimatePresence mode="popLayout">
          {filteredOrders.map((o, i) => (
            <motion.tr
              key={o._id}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.03 }}
          onClick={() => { setSelectedOrder(o); setActiveTab('details'); }}
          className={`text-xs border-b border-slate-800/60 font-mono cursor-pointer transition-colors group ${selectedOrder?._id === o._id
            ? 'bg-[#0088FF]/5 border-l-2 border-l-[#0088FF]'
            : 'hover:bg-slate-800/40'
            }`}
                  >
          <td className="py-4 px-5">
            <div className="flex flex-col gap-0.5">
              <span className="text-[#0088FF] font-black">#{o._id.slice(-6).toUpperCase()}</span>
              <span className="text-[9px] text-slate-600">{o.orderItems?.length ?? 0} item{o.orderItems?.length !== 1 ? 's' : ''}</span>
            </div>
          </td>
          <td className="py-4 px-4 text-slate-500">
            <div className="flex flex-col gap-0.5">
              <span>{new Date(o.createdAt).toLocaleDateString('en-BD')}</span>
              <span className="text-[9px] text-slate-700">{new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </td>
          <td className="py-4 px-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-200 font-bold">{getClientName(o)}</span>
              <span className="text-[9px] text-slate-600 truncate max-w-[140px]">{getClientEmail(o)}</span>
            </div>
          </td>
          <td className="py-4 px-4">
            <span className="font-black text-white">৳ {o.totalAmount.toLocaleString()}</span>
          </td>
          <td className="py-4 px-4">
            <StatusBadge label={o.orderStatus} type="order" />
          </td>
          <td className="py-4 px-4">
            <StatusBadge label={o.paymentStatus} type="payment" />
          </td>
          <td className="py-4 px-5 text-right">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); setActiveTab('details'); }}
            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-[#0088FF]/40 text-[#0088FF] font-bold text-[10px] transition-all"
                      >
            <span className="material-symbols-outlined text-[11px]">open_in_new</span>
            View
          </motion.button>
        </td>
      </motion.tr>
                ))}
    </AnimatePresence>

{
  filteredOrders.length === 0 && (
    <tr>
      <td colSpan={7}>
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-600 text-2xl">receipt_long</span>
          </div>
          <p className="text-sm font-bold text-slate-500 font-mono">No orders found</p>
          <p className="text-xs text-slate-700 font-mono">Try adjusting your search or filter</p>
        </div>
      </td>
    </tr>
  )
}
            </tbody >
          </table >
        </div >

  {/* Table Footer */ }
  < div className = "px-5 py-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-600 bg-slate-800/20" >
          <span>Showing <span className="text-slate-400 font-bold">{filteredOrders.length}</span> of <span className="text-slate-400 font-bold">{orders.length}</span> orders</span>
          <span>Total: <span className="text-[#0088FF] font-bold">৳ {filteredOrders.reduce((a, o) => a + o.totalAmount, 0).toLocaleString()}</span></span>
        </div >
      </motion.div >

  {/* ── Order Detail Drawer ── */ }
  <AnimatePresence>
{
  selectedOrder && (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      onClick={() => setSelectedOrder(null)}
      className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 240 }}
      className="relative w-full max-w-lg h-screen bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col"
            >
      {/* Drawer Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/40 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono text-[#0088FF] tracking-widest uppercase">Invoice</span>
              <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300 font-bold">
                #{selectedOrder._id.slice(-8).toUpperCase()}
              </span>
              <StatusBadge label={selectedOrder.orderStatus} type="order" />
            </div>
            <p className="text-[10px] text-slate-600 font-mono mt-1">
              {new Date(selectedOrder.createdAt).toLocaleString('en-BD', { dateStyle: 'full', timeStyle: 'short' })}
            </p>
          </div>
          <button
            onClick={() => setSelectedOrder(null)}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Shipment Timeline */}
        <div className="mt-4">
          <OrderTimeline status={selectedOrder.orderStatus} />
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex border-b border-slate-800 bg-slate-900/80 flex-shrink-0">
        {([
          { id: 'details', label: 'Client & Shipping', icon: 'person' },
          { id: 'items', label: 'Line Items', icon: 'receipt_long' },
          { id: 'history', label: 'Update Status', icon: 'tune' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[10px] font-mono font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === tab.id
              ? 'border-[#0088FF] text-[#0088FF]'
              : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
          >
            <span className="material-symbols-outlined text-sm">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* ── Details Tab ── */}
          {activeTab === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
          className="p-5 space-y-5"
                    >
          {/* Client Card */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0088FF]/15 border border-[#0088FF]/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#0088FF]">person</span>
              </div>
              <div>
                <p className="font-black text-white text-sm">{getClientName(selectedOrder)}</p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {selectedOrder.guestDetails ? 'Guest Checkout' : 'Registered User'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/40">
              <InfoField icon="email" label="Email" value={getClientEmail(selectedOrder)} />
              <InfoField icon="call" label="Phone" value={getClientPhone(selectedOrder)} />
            </div>
            <div className="pt-2 border-t border-slate-700/40">
              <InfoField icon="location_on" label="Shipping Address" value={selectedOrder.shippingAddress} full />
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Payment Summary</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusBadge label={selectedOrder.paymentStatus} type="payment" />
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-mono">Total Invoice</p>
                <p className="text-2xl font-black text-[#0088FF] font-mono">
                  ৳ {selectedOrder.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
                  )}

        {/* ── Items Tab ── */}
        {activeTab === 'items' && (
          <motion.div
            key="items"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
        className="p-5"
                    >
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">
          {/* Items header */}
          <div className="grid grid-cols-[1fr_auto] gap-4 px-4 py-2.5 bg-slate-800/60 border-b border-slate-700/40 text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
            <span>Product</span>
            <span className="text-right">Subtotal</span>
          </div>
          <div className="divide-y divide-slate-700/30">
            {selectedOrder.orderItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
            className="flex items-center justify-between p-4 gap-4 hover:bg-slate-700/20 transition-colors"
                            >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-slate-400 text-base">inventory_2</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">{item.name}</p>
                <p className="text-[9px] font-mono text-slate-500 mt-0.5">
                  {item.qty} × ৳ {item.price.toLocaleString()}
                </p>
              </div>
            </div>
            <span className="text-sm font-black text-white font-mono flex-shrink-0">
              ৳ {(item.qty * item.price).toLocaleString()}
            </span>
          </motion.div>
                          ))}
        </div>
        {/* Total */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/60 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400 font-mono">ORDER TOTAL</span>
          <span className="text-xl font-black text-[#0088FF] font-mono">
            ৳ {selectedOrder.totalAmount.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

{/* ── Update Status Tab ── */ }
{
  activeTab === 'history' && (
    <motion.div
      key="history"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
  className = "p-5 space-y-4"
    >
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 space-y-5">
      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Update Order Status</p>

      {/* Shipment Status */}
      <div className="space-y-2">
        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">Shipment</label>
        <div className="grid grid-cols-3 gap-2">
          {['processing', 'shipped', 'delivered'].map(s => {
            const cfg = getStatus(s.toUpperCase());
            const active = selectedOrder.orderStatus.toLowerCase() === s;
            return (
              <button
                key={s}
                disabled={updatingId === selectedOrder._id}
                onClick={() => handleStatusChange(selectedOrder._id, { status: s })}
                className={`py-2.5 px-3 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${active
                  ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                  : 'bg-slate-800/60 border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="material-symbols-outlined text-base">{cfg.icon}</span>
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment Status */}
      <div className="space-y-2">
        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">Payment</label>
        <div className="grid grid-cols-3 gap-2">
          {['pending', 'paid', 'refunded'].map(s => {
            const cfg = getPayment(s.toUpperCase());
            const active = selectedOrder.paymentStatus.toLowerCase() === s;
            return (
              <button
                key={s}
                disabled={updatingId === selectedOrder._id}
                onClick={() => handleStatusChange(selectedOrder._id, { paymentStatus: s })}
                className={`py-2.5 px-3 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${active
                  ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                  : 'bg-slate-800/60 border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="material-symbols-outlined text-base">{cfg.icon}</span>
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {updatingId === selectedOrder._id && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
      className="flex items-center gap-2 text-[10px] font-mono text-[#0088FF]"
                          >
      <span className="material-symbols-outlined text-sm animate-spin">autorenew</span>
      Saving changes...
    </motion.div>
                        )
}
                      </div >
                    </motion.div >
                  )}
                </AnimatePresence >
              </div >

  {/* Drawer Footer */ }
  < div className = "p-5 border-t border-slate-800 bg-slate-950/30 flex gap-3 flex-shrink-0" >
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center justify-center gap-2 flex-1 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 text-xs font-bold font-mono transition-all"
                >
                  <span className="material-symbols-outlined text-sm">delete_forever</span>
                  Delete Log
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex items-center justify-center gap-2 flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold font-mono transition-all"
                >
                  <span className="material-symbols-outlined text-sm">check</span>
                  Done
                </button>
              </div >
            </motion.div >
          </div >
        )}
      </AnimatePresence >

  {/* ── Delete Confirm Dialog ── */ }
  <AnimatePresence>
{
  showDeleteConfirm && (
    <ConfirmDialog
      onConfirm={handleDeleteOrder}
      onCancel={() => setShowDeleteConfirm(false)}
    />
  )
}
      </AnimatePresence >
    </div >
  );
}

// ── Helper: Info Field ────────────────────────────────────────────────────────
function InfoField({ icon, label, value, full }: { icon: string; label: string; value: string; full?: boolean }) {
  return (
    <div className={`flex items-start gap-2 ${full ? 'col-span-2' : ''}`}>
      <span className="material-symbols-outlined text-slate-600 text-sm mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">{label}</p>
        <p className="text-xs font-bold text-slate-200 mt-0.5 leading-relaxed break-words">{value || '—'}</p>
      </div>
    </div>
  );
}