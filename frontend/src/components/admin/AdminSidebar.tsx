'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export type AdminTab = 'dashboard' | 'inventory' | 'orders' | 'users' | 'banners-logo' | 'promos' | 'homepage-sections' | 'settings' | 'audit-logs';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  onExit: () => void;
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: string;
  desc: string;
  badge?: number;
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Control Desk',
    icon: 'dashboard',
    desc: 'System overview & sales metrics',
    section: 'CORE',
  },
  {
    id: 'inventory',
    label: 'Inventory Hub',
    icon: 'inventory_2',
    desc: 'Product listings & stock levels',
    badge: 3,
    section: 'CORE',
  },
  {
    id: 'orders',
    label: 'Orders Ledger',
    icon: 'receipt_long',
    desc: 'Customer transactions & statuses',
    badge: 12,
    section: 'CORE',
  },
  {
    id: 'users',
    label: 'User Directory',
    icon: 'groups',
    desc: 'Administrators & customers',
    section: 'CORE',
  },
  {
    id: 'banners-logo',
    label: 'Banners & Logo',
    icon: 'branding_watermark',
    desc: 'Banners and logo branding',
    section: 'MARKETING',
  },
  {
    id: 'promos',
    label: 'Promo Codes',
    icon: 'local_offer',
    desc: 'Discount codes and offers',
    section: 'MARKETING',
  },
  {
    id: 'homepage-sections',
    label: 'Section Manager',
    icon: 'grid_view',
    desc: 'Homepage product sections layout',
    section: 'MARKETING',
  },
  {
    id: 'settings',
    label: 'System Config',
    icon: 'tune',
    desc: 'Roles, security & preferences',
    section: 'SYSTEM',
  },
  {
    id: 'audit-logs',
    label: 'Audit Logs',
    icon: 'history_toggle_off',
    desc: 'Admin and system activity logs',
    section: 'SYSTEM',
  },
];

const QUICK_STATS = [
  { label: 'Revenue', value: '$24.8K', trend: '+12%', up: true },
  { label: 'Orders', value: '184', trend: '+5%', up: true },
  { label: 'Returns', value: '9', trend: '-2%', up: false },
];

const STATUS_ITEMS = [
  { label: 'API', status: 'online' },
  { label: 'DB', status: 'online' },
  { label: 'CDN', status: 'degraded' },
];

const sidebarVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.25, ease: 'easeOut' as const },
  }),
};

function StatusDot({ status }: { status: string }) {
  const color =
    status === 'online'
      ? 'bg-emerald-400 shadow-emerald-400/60'
      : status === 'degraded'
        ? 'bg-amber-400 shadow-amber-400/60'
        : 'bg-red-400 shadow-red-400/60';
  return (
    <span
      className={`inline-block w-1.5 h-1.5 rounded-full shadow-sm ${color}`}
      style={{ boxShadow: `0 0 5px currentColor` }}
    />
  );
}

const getAllowedNavItems = (role: string): NavItem[] => {
  switch (role) {
    case 'super_admin':
      return NAV_ITEMS;
    case 'admin':
    case 'demo_admin':
      return NAV_ITEMS.filter((item) => item.id !== 'users');
    case 'manager':
      return NAV_ITEMS.filter((item) => !['users', 'settings', 'audit-logs'].includes(item.id));
    case 'staff':
      return NAV_ITEMS.filter((item) => ['dashboard', 'orders'].includes(item.id));
    default:
      return [];
  }
};

export default function AdminSidebar({ activeTab, setActiveTab, onExit }: AdminSidebarProps) {
  const { user, logout } = useAuth();
  const [statsExpanded, setStatsExpanded] = useState(true);

  const allowedNavItems = getAllowedNavItems(user?.role || 'customer');
  const sections = [...new Set(allowedNavItems.map((i) => i.section))];

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="w-72 bg-slate-950 border-r border-slate-800/60 flex flex-col h-screen overflow-hidden select-none"
    >
      {/* ── Brand Header ─────────────────────────────── */}
      <div className="px-5 py-5 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF4B7E] to-[#FF85A7] flex items-center justify-center shadow-lg shadow-[#FF4B7E]/25 flex-shrink-0">
            <span className="material-symbols-outlined text-white text-[18px]">terminal</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-black text-slate-100 uppercase tracking-[0.15em] font-mono">
                GRABALL
              </span>
              <span className="px-1.5 py-[2px] rounded-md text-[8px] font-black bg-gradient-to-r from-[#FF4B7E] to-[#FF85A7] text-white tracking-widest leading-none">
                OS
              </span>
            </div>
            <p className="text-[10px] text-slate-600 font-mono tracking-wider mt-0.5">
              v1.2.0 · SECURE MODE
            </p>
          </div>
          {/* Notification Bell */}
          <button className="relative w-8 h-8 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/40 flex items-center justify-center transition-colors group">
            <span className="material-symbols-outlined text-slate-500 group-hover:text-slate-300 text-[16px] transition-colors">
              notifications
            </span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF4B7E] border border-slate-950" />
          </button>
        </div>
      </div>

      {/* ── Quick Stats (collapsible) ─────────────────── */}
      <div className="px-4 pt-4">
        <button
          onClick={() => setStatsExpanded((v) => !v)}
          className="w-full flex items-center justify-between mb-2 px-1 group"
        >
          <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] font-mono group-hover:text-slate-500 transition-colors">
            Live Snapshot
          </span>
          <motion.span
            animate={{ rotate: statsExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="material-symbols-outlined text-slate-600 text-[14px] group-hover:text-slate-500 transition-colors"
          >
            expand_more
          </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {statsExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
        <div className="grid grid-cols-3 gap-2 pb-4">
          {QUICK_STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-900 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-0.5"
            >
              <span className="text-[9px] text-slate-600 font-mono uppercase tracking-wider">
                {stat.label}
              </span>
              <span className="text-sm font-black text-slate-200 font-mono leading-none">
                {stat.value}
              </span>
              <span
                className={`text-[9px] font-bold font-mono ${stat.up ? 'text-emerald-400' : 'text-red-400'
                  }`}
              >
                {stat.trend}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
          )}
    </AnimatePresence>
      </div >

    {/* ── Navigation ───────────────────────────────── */ }
    < nav className = "flex-1 px-3 pb-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-800" >
    {
      sections.map((section) => (
        <div key={section}>
          <p className="px-2 mb-1.5 text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] font-mono">
            {section}
          </p>
          <div className="space-y-0.5">
            {allowedNavItems.filter((item) => item.section === section).map((item, i) => {
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 relative group overflow-hidden ${isActive
                      ? 'bg-slate-800/80 border border-slate-700/50 shadow-md shadow-black/20'
                      : 'hover:bg-slate-900 border border-transparent'
                    }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r-full bg-gradient-to-b from-[#FF4B7E] to-[#FF85A7]"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                    )}

                  {/* Icon container */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${isActive
                        ? 'bg-gradient-to-br from-[#FF4B7E]/20 to-[#FF85A7]/10 border border-[#FF4B7E]/30'
                        : 'bg-slate-800/60 border border-slate-700/30 group-hover:border-slate-600/40'
                      }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] transition-colors duration-200 ${isActive ? 'text-[#FF4B7E]' : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                    >
                      {item.icon}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-[12px] font-bold tracking-wide leading-none transition-colors ${isActive ? 'text-slate-100' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                    >
                      {item.label}
                    </h4>
                    <p className="text-[10px] text-slate-600 mt-0.5 group-hover:text-slate-500 transition-colors truncate">
                      {item.desc}
                    </p>
                  </div>

                  {/* Badge */}
                  {item.badge !== undefined && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-black flex items-center justify-center font-mono ${isActive
                      ? 'bg-[#FF4B7E] text-white'
                      : 'bg-slate-800 text-slate-400 border border-slate-700/60 group-hover:border-slate-600'
                    }`}
                      >
                  {item.badge}
                </motion.span>
              )
            }
                  </motion.button>
          );
              })}
        </div>
          </div >
        ))
    }
      </nav >

    {/* ── System Status Bar ─────────────────────────── */ }
    < div className = "px-4 py-3 border-t border-slate-800/60 bg-slate-950" >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] font-mono">
            System Status
          </span>
          <span className="text-[9px] font-mono text-slate-700">
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {STATUS_ITEMS.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <StatusDot status={s.status} />
              <span className="text-[9px] font-mono text-slate-600">{s.label}</span>
            </div>
          ))}
        </div>
      </div >

    {/* ── Admin Profile Footer ──────────────────────── */ }
    < div className = "px-4 py-4 border-t border-slate-800/60 bg-slate-950" >
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800/60 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700/60 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[#FF4B7E] text-[16px]">
              admin_panel_settings
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[11px] font-bold text-slate-200 truncate leading-none">
              {user?.name || 'Administrator'}
            </h4>
            <p className="text-[9px] text-slate-600 font-mono truncate mt-0.5">
              {user?.email || 'admin@graball.com'}
            </p>
          </div>
          <span className="flex-shrink-0 px-1.5 py-0.5 rounded-md text-[8px] font-black bg-[#FF4B7E]/10 text-[#FF4B7E] border border-[#FF4B7E]/20 tracking-wider font-mono uppercase">
            {user?.role ? user.role.replace('_', ' ') : 'ADMIN'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onExit}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all text-[11px] font-bold font-mono border border-slate-800/60 hover:border-slate-700/60"
          >
            <span className="material-symbols-outlined text-[14px]">logout</span>
            Exit Panel
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { logout(); onExit(); }}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-red-950/30 hover:bg-red-900/30 text-red-500 hover:text-red-400 transition-all text-[11px] font-bold font-mono border border-red-900/30 hover:border-red-800/40"
          >
            <span className="material-symbols-outlined text-[14px]">power_settings_new</span>
            Sign Out
          </motion.button>
        </div >
      </div >
    </motion.aside >
  );
}