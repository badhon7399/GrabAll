import { useState, useEffect, useCallback } from 'react';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';
import SecurityShield from './SecurityShield';
import AdminSidebar from './AdminSidebar';
import DashboardTab from './DashboardTab';
import InventoryTab from './InventoryTab';
import OrdersTab from './OrdersTab';
import BannersTab from './BannersTab';
import PromosTab from './PromosTab';
import SettingsTab from './SettingsTab';
import UsersTab from './UsersTab';
import SectionsTab from './SectionsTab';
import AuditLogsTab from './AuditLogsTab';
import type { AdminTab } from './AdminSidebar';
import type { Product, Order } from '../../types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminLayoutProps {
  setCurrentTab: (tab: any) => void;
  triggerToast: (message: string) => void;
}

interface OrderStatusUpdate {
  status?: string;
  paymentStatus?: string;
}

interface RevenueDataPoint {
  label: string;
  value: number;
}

interface CategoryDataPoint {
  name: string;
  count: number;
  percentage: number;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function buildRevenueData(orders: Order[]): RevenueDataPoint[] {
  const INTERVAL_COUNT = 6;
  const EMPTY: RevenueDataPoint[] = Array.from({ length: INTERVAL_COUNT }, (_, i) => ({
    label: i < INTERVAL_COUNT - 1 ? `P${i + 1}` : 'Recent',
    value: 0,
  }));

  const active = orders
    .filter((o) => o.orderStatus.toUpperCase() !== 'CANCELLED')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  if (active.length === 0) return EMPTY;

  if (active.length < INTERVAL_COUNT) {
    return active.map((o, i) => ({ label: `Interval ${i + 1}`, value: o.totalAmount }));
  }

  const chunkSize = Math.ceil(active.length / INTERVAL_COUNT);
  const intervals: RevenueDataPoint[] = [];

  for (let i = 0; i < active.length && intervals.length < INTERVAL_COUNT; i += chunkSize) {
    const chunk = active.slice(i, i + chunkSize);
    intervals.push({
      label: `P${intervals.length + 1}`,
      value: chunk.reduce((sum, o) => sum + o.totalAmount, 0),
    });
  }

  while (intervals.length < INTERVAL_COUNT) {
    intervals.push({ label: 'Recent', value: 0 });
  }

  return intervals;
}

function buildCategoryDistribution(products: Product[]): CategoryDataPoint[] {
  const categories = Array.from(new Set(products.map((p) => p.category)));
  return categories.map((cat) => {
    const count = products.filter((p) => p.category === cat).length;
    return {
      name: cat,
      count,
      percentage: Math.round((count / products.length) * 100),
    };
  });
}

// ─── Custom Hook ──────────────────────────────────────────────────────────────

function useAdminData(token: string | undefined, triggerToast: (msg: string) => void) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);

    try {
      const [prodRes, orderRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products`),
        fetch(`${API_BASE_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (orderRes.ok) setOrders(await orderRes.json());
    } catch (error) {
      console.error('[AdminLayout] Data fetch failed:', error);
      triggerToast('Failed to sync data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [token, triggerToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { products, orders, loading, refresh: fetchData };
}

const getAllowedNavItems = (role: string): AdminTab[] => {
  switch (role) {
    case 'super_admin':
      return ['dashboard', 'inventory', 'orders', 'users', 'banners-logo', 'promos', 'homepage-sections', 'settings', 'audit-logs'];
    case 'admin':
    case 'demo_admin':
      return ['dashboard', 'inventory', 'orders', 'banners-logo', 'promos', 'homepage-sections', 'settings', 'audit-logs'];
    case 'manager':
      return ['dashboard', 'inventory', 'orders', 'banners-logo', 'promos', 'homepage-sections'];
    case 'staff':
      return ['dashboard', 'orders'];
    default:
      return [];
  }
};

export default function AdminLayout({ setCurrentTab, triggerToast }: AdminLayoutProps) {
  const { user } = useAuth();
  const allowedTabs = getAllowedNavItems(user?.role || 'customer');
  
  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    return allowedTabs.length > 0 ? allowedTabs[0] : 'dashboard';
  });

  useEffect(() => {
    if (user && !allowedTabs.includes(activeTab)) {
      if (allowedTabs.length > 0) {
        setActiveTab(allowedTabs[0]);
      }
    }
  }, [activeTab, allowedTabs, user]);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('adminTheme') as 'dark' | 'light') || 'dark';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('adminTheme', nextTheme);
  };

  const { products, orders, loading, refresh } = useAdminData(user?.token, triggerToast);

  const handleExit = () => setCurrentTab('home');

  // ── Product Handlers ──────────────────────────────────────────────────────

  const handleSaveProduct = async (payload: Partial<Product>) => {
    if (!user?.token) return;

    const isEdit = Boolean(payload._id);
    const url = isEdit
      ? `${API_BASE_URL}/products/${payload._id}`
      : `${API_BASE_URL}/products`;

    try {
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        triggerToast(isEdit ? 'Product updated successfully.' : 'Product created successfully.');
        refresh();
      } else {
        const { message } = await res.json();
        triggerToast(message ?? 'Failed to save product.');
      }
    } catch (error) {
      console.error('[AdminLayout] Save product failed:', error);
      triggerToast('Network error. Please try again.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!user?.token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (res.ok) {
        triggerToast('Product removed.');
        refresh();
      } else {
        triggerToast('Failed to remove product.');
      }
    } catch (error) {
      console.error('[AdminLayout] Delete product failed:', error);
      triggerToast('Network error. Please try again.');
    }
  };

  // ── Order Handlers ────────────────────────────────────────────────────────

  const handleUpdateOrderStatus = async (id: string, updates: OrderStatusUpdate) => {
    if (!user?.token) return;

    const payload = {
      ...(updates.status && { orderStatus: updates.status }),
      ...(updates.paymentStatus && { paymentStatus: updates.paymentStatus }),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        triggerToast('Order status updated.');
        refresh();
      } else {
        triggerToast('Failed to update order status.');
      }
    } catch (error) {
      console.error('[AdminLayout] Update order status failed:', error);
      triggerToast('Network error. Please try again.');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!user?.token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (res.ok) {
        triggerToast('Order deleted.');
        refresh();
      } else {
        triggerToast('Failed to delete order.');
      }
    } catch (error) {
      console.error('[AdminLayout] Delete order failed:', error);
      triggerToast('Network error. Please try again.');
    }
  };

  // ── Derived Data ──────────────────────────────────────────────────────────

  const activeOrders = orders.filter((o) => o.orderStatus.toUpperCase() !== 'CANCELLED');
  const totalSales = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // ── Render ────────────────────────────────────────────────────────────────

  const isInitialLoad = loading && products.length === 0;

  return (
    <SecurityShield onExit={handleExit}>
      <div className={`min-h-screen flex overflow-hidden font-sans ${
        theme === 'light' ? 'admin-light-theme bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}>
        <style dangerouslySetInnerHTML={{ __html: `
          .admin-light-theme {
            --accent-color: #FF4B7E;
            background-color: #f8fafc !important;
            color: #0f172a !important;
          }
          /* Headings and generic text color overrides */
          .admin-light-theme h1,
          .admin-light-theme h2,
          .admin-light-theme h3,
          .admin-light-theme h4,
          .admin-light-theme h5,
          .admin-light-theme h6 {
            color: #0f172a !important;
          }
          .admin-light-theme .text-white:not(button):not(.bg-indigo-600):not(.bg-\\[\\#FF4B7E\\]):not(.bg-slate-800):not(.bg-\\[\\#0088FF\\]):not(.bg-[#FF4B7E]):not(.bg-emerald-500):not(.bg-rose-500):not(.bg-amber-500):not(.bg-red-500\\/10) {
            color: #0f172a !important;
          }
          
          /* Background and container overrides */
          .admin-light-theme .bg-slate-950,
          .admin-light-theme .bg-\\[\\#020617\\] {
            background-color: #f8fafc !important;
          }
          .admin-light-theme .bg-slate-900\\/40,
          .admin-light-theme .bg-slate-900 {
            background-color: #ffffff !important;
            box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.05) !important;
          }
          .admin-light-theme .bg-\\[\\#0f1117\\],
          .admin-light-theme .bg-\\[\\#0f121d\\],
          .admin-light-theme .bg-\\[\\#0d0e12\\] {
            background-color: #ffffff !important;
            border-color: #e2e8f0 !important;
            box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.04), 0 4px 6px -4px rgba(15, 23, 42, 0.04) !important;
          }
          
          /* Text overrides */
          .admin-light-theme .text-slate-100,
          .admin-light-theme .text-slate-200,
          .admin-light-theme .text-slate-300 {
            color: #0f172a !important;
          }
          .admin-light-theme .text-slate-400 {
            color: #334155 !important;
          }
          .admin-light-theme .text-slate-500 {
            color: #475569 !important;
          }
          .admin-light-theme .text-slate-600 {
            color: #64748b !important;
          }
          .admin-light-theme .text-slate-700 {
            color: #94a3b8 !important;
          }
          
          /* Background overrides for sub-components (lists, cards, groups) */
          .admin-light-theme .bg-white\\/5,
          .admin-light-theme .bg-white\\/\\[0\\.03\\],
          .admin-light-theme .bg-white\\/\\[0\\.02\\],
          .admin-light-theme .bg-white\\/\\[0\\.01\\],
          .admin-light-theme .bg-slate-800,
          .admin-light-theme .bg-slate-800\\/50,
          .admin-light-theme .bg-slate-800\\/40 {
            background-color: #f8fafc !important;
            border-color: #e2e8f0 !important;
          }
          
          .admin-light-theme .hover\\:bg-white\\/\\[0\\.02\\]:hover,
          .admin-light-theme .hover\\:bg-slate-800\\/40:hover,
          .admin-light-theme .hover\\:bg-slate-800\\/70:hover,
          .admin-light-theme .hover\\:bg-slate-900:hover,
          .admin-light-theme .hover\\:bg-slate-900\\/50:hover {
            background-color: #f1f5f9 !important;
          }
          
          /* Borders */
          .admin-light-theme .border-slate-800,
          .admin-light-theme .border-slate-800\\/60,
          .admin-light-theme .border-slate-750,
          .admin-light-theme .border-slate-700,
          .admin-light-theme .border-slate-700\\/50,
          .admin-light-theme .border-slate-700\\/40,
          .admin-light-theme .border-slate-700\\/30,
          .admin-light-theme .border-white\\/5,
          .admin-light-theme .border-white\\/\\[0\\.07\\],
          .admin-light-theme .border-white\\/\\[0\\.05\\],
          .admin-light-theme .border-white\\/\\[0\\.04\\] {
            border-color: #e2e8f0 !important;
          }
          
          /* Forms and inputs */
          .admin-light-theme input,
          .admin-light-theme select,
          .admin-light-theme textarea {
            background-color: #ffffff !important;
            border: 1px solid #cbd5e1 !important;
            color: #0f172a !important;
          }
          .admin-light-theme input[type="checkbox"] {
            background-color: #ffffff !important;
            border: 1px solid #cbd5e1 !important;
          }
          .admin-light-theme input::placeholder,
          .admin-light-theme textarea::placeholder {
            color: #94a3b8 !important;
          }
          .admin-light-theme input:focus,
          .admin-light-theme select:focus,
          .admin-light-theme textarea:focus {
            border-color: #6366f1 !important;
            box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.1) !important;
          }
          
          /* Sidebar Custom Overrides */
          .admin-light-theme .w-72.bg-slate-950 {
            background-color: #ffffff !important;
            border-right: 1px solid #e2e8f0 !important;
          }
          .admin-light-theme .w-72.bg-slate-950 .bg-slate-950 {
            background-color: #ffffff !important;
            border-top: 1px solid #e2e8f0 !important;
          }
          .admin-light-theme .w-72.bg-slate-950 .bg-slate-900 {
            background-color: #f8fafc !important;
            border-color: #e2e8f0 !important;
          }
          .admin-light-theme .w-72.bg-slate-950 .bg-slate-900.text-slate-400 {
            background-color: #f8fafc !important;
            border-color: #e2e8f0 !important;
            color: #475569 !important;
          }
          .admin-light-theme .w-72.bg-slate-950 .bg-slate-900.text-slate-400:hover {
            background-color: #f1f5f9 !important;
            color: #0f172a !important;
            border-color: #cbd5e1 !important;
          }
          .admin-light-theme .w-72.bg-slate-950 .bg-red-950\\/30 {
            background-color: #fef2f2 !important;
            border-color: #fee2e2 !important;
            color: #dc2626 !important;
          }
          .admin-light-theme .w-72.bg-slate-950 .bg-red-950\\/30:hover {
            background-color: #fee2e2 !important;
            color: #b91c1c !important;
            border-color: #fca5a5 !important;
          }
          
          /* Inactive/hover sidebar items */
          .admin-light-theme .group h4 {
            color: #475569 !important;
          }
          .admin-light-theme .group:hover h4 {
            color: #0f172a !important;
          }
          .admin-light-theme .border-transparent {
            border-color: transparent !important;
          }
          
          /* Active Sidebar Item */
          .admin-light-theme .bg-slate-800\\/80 {
            background-color: #fff1f5 !important;
            border-color: #ffe4e6 !important;
            box-shadow: none !important;
          }
          .admin-light-theme .bg-slate-800\\/80 h4 {
            color: #FF4B7E !important;
          }
          .admin-light-theme .bg-slate-800\\/80 p {
            color: #fda4af !important;
          }
          .admin-light-theme .bg-slate-800\\/60 {
            background-color: #f1f5f9 !important;
            border-color: #cbd5e1 !important;
          }
          
          /* Badges and tags */
          .admin-light-theme .bg-indigo-600\\/20 {
            background-color: #e0e7ff !important;
            color: #4f46e5 !important;
          }
          .admin-light-theme .text-indigo-300 {
            color: #4f46e5 !important;
          }
          .admin-light-theme .border-indigo-500\\/40 {
            border-color: #818cf8 !important;
          }
          
          /* Status & Payment badging (Contrast fix) */
          .admin-light-theme .text-emerald-400 { color: #047857 !important; }
          .admin-light-theme .bg-emerald-500\\/10 { background-color: #d1fae5 !important; border-color: #a7f3d0 !important; }
          .admin-light-theme .text-blue-400 { color: #1d4ed8 !important; }
          .admin-light-theme .bg-blue-500\\/10 { background-color: #dbeafe !important; border-color: #bfdbfe !important; }
          .admin-light-theme .text-amber-400 { color: #b45309 !important; }
          .admin-light-theme .bg-amber-500\\/10 { background-color: #fef3c7 !important; border-color: #fde68a !important; }
          .admin-light-theme .text-slate-400 { color: #475569 !important; }
          .admin-light-theme .bg-slate-500\\/10 { background-color: #f1f5f9 !important; border-color: #e2e8f0 !important; }
          .admin-light-theme .text-red-400 { color: #b91c1c !important; }
          .admin-light-theme .bg-red-500\\/10 { background-color: #fee2e2 !important; border-color: #fca5a5 !important; }
          .admin-light-theme .border-slate-950 { border-color: #ffffff !important; }
          
          /* Scrollbar styling */
          .admin-light-theme .scrollbar-thumb-slate-800 {
            --scrollbar-thumb: #cbd5e1;
          }
          
          /* SVG and Charts overrides */
          .admin-light-theme svg line[stroke="#1e293b"],
          .admin-light-theme svg circle[stroke="#1e293b"],
          .admin-light-theme svg path[stroke="#1e293b"] {
            stroke: #e2e8f0 !important;
          }
          .admin-light-theme svg text[fill="white"] {
            fill: #0f172a !important;
          }
          .admin-light-theme .fill-white {
            fill: #0f172a !important;
          }
          .admin-light-theme .fill-slate-100 {
            fill: #475569 !important;
          }
          
          /* Dialogs and timelines in drawer */
          .admin-light-theme .fixed .bg-slate-900 {
            background-color: #ffffff !important;
            border-color: #e2e8f0 !important;
          }
          .admin-light-theme .fixed .bg-slate-950\\/40,
          .admin-light-theme .fixed .bg-slate-950\\/30 {
            background-color: #f8fafc !important;
            border-color: #e2e8f0 !important;
          }
          
          /* Divider lines in tables and layouts */
          .admin-light-theme .divide-white\\/\\[0\\.03\\] > * + * {
            border-color: #e2e8f0 !important;
          }
          
          /* Header buttons custom overrides */
          .admin-light-theme header button {
            border-color: #cbd5e1 !important;
            color: #475569 !important;
          }
          .admin-light-theme header button:hover {
            background-color: #f1f5f9 !important;
            border-color: #94a3b8 !important;
            color: #0f172a !important;
          }
        ` }} />
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onExit={handleExit} />

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <header className="h-16 border-b border-slate-800 bg-slate-900/40 px-8 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                Secure · TLS Active
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                className="w-8 h-8 rounded-lg border border-slate-800 hover:border-slate-700 bg-transparent hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>

              <button
                onClick={refresh}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-transparent hover:bg-slate-800 text-xs font-mono font-semibold text-slate-300 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className={`material-symbols-outlined text-sm ${loading ? 'animate-spin' : ''}`}>
                  refresh
                </span>
                Refresh
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-8 lg:p-10 relative">
            {/* Ambient background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute top-10 left-10 w-[300px] h-[300px] rounded-full bg-[#0088FF]/5 blur-[100px]" />
              <div className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full bg-[#FF4B7E]/5 blur-[100px]" />
            </div>

            {isInitialLoad ? (
              <div className="relative h-[60vh] flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-slate-800 border-t-[#FF4B7E] animate-spin" />
                <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">
                  Loading dashboard data…
                </p>
              </div>
            ) : (
              <div className="relative">
                {activeTab === 'dashboard' && (
                  <DashboardTab
                    totalSales={totalSales}
                    ordersCount={orders.length}
                    productsCount={products.length}
                    lowStockCount={lowStockCount}
                    revenueData={buildRevenueData(orders)}
                    categoryDistribution={buildCategoryDistribution(products)}
                  />
                )}

                {activeTab === 'inventory' && (
                  <InventoryTab
                    products={products}
                    onSaveProduct={handleSaveProduct}
                    onDeleteProduct={handleDeleteProduct}
                    categories={categories}
                    triggerToast={triggerToast}
                  />
                )}

                {activeTab === 'orders' && (
                  <OrdersTab
                    orders={orders}
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                    onDeleteOrder={handleDeleteOrder}
                  />
                )}

                {activeTab === 'banners-logo' && (
                  <BannersTab triggerToast={triggerToast} />
                )}

                {activeTab === 'promos' && (
                  <PromosTab triggerToast={triggerToast} />
                )}

                {activeTab === 'homepage-sections' && (
                  <SectionsTab products={products} triggerToast={triggerToast} />
                )}

                {activeTab === 'users' && (
                  <UsersTab triggerToast={triggerToast} />
                )}

                {activeTab === 'settings' && (
                  <SettingsTab triggerToast={triggerToast} />
                )}

                {activeTab === 'audit-logs' && (
                  <AuditLogsTab triggerToast={triggerToast} />
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </SecurityShield>
  );
}