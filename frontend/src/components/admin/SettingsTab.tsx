import React, { useState, useEffect } from 'react';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';

const inputCls =
  'w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.07] hover:border-white/10 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 rounded-xl text-slate-200 text-xs font-sans placeholder-slate-600 outline-none transition-all duration-200';

export interface StoreSettings {
  storeName: string;
  adminEmail: string;
  currency: string;
  shippingFee: number;
  enableCod: boolean;
  maintenanceMode: boolean;
  theme: 'dark' | 'light';
  whatsappNumber: string;
}

export default function SettingsTab({ triggerToast }: { triggerToast: (msg: string) => void }) {
  const { user } = useAuth();
  const [storeName, setStoreName] = useState('GrabAll');
  const [adminEmail, setAdminEmail] = useState('admin@graballgoods.com');
  const [currency, setCurrency] = useState('৳');
  const [shippingFee, setShippingFee] = useState(0);
  const [enableCod, setEnableCod] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('8801700000000');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/settings`);
        if (res.ok) {
          const data = await res.json();
          if (data.storeSettings) {
            const parsed = data.storeSettings;
            setStoreName(parsed.storeName || 'GrabAll');
            setAdminEmail(parsed.adminEmail || 'admin@graballgoods.com');
            setCurrency(parsed.currency || '৳');
            setShippingFee(parsed.shippingFee ?? 0);
            setEnableCod(parsed.enableCod ?? true);
            setMaintenanceMode(parsed.maintenanceMode ?? false);
            setWhatsappNumber(parsed.whatsappNumber || '8801700000000');
            localStorage.setItem('grabAllSettings', JSON.stringify(parsed));
            window.dispatchEvent(new Event('settingsUpdated'));
          }
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: StoreSettings = {
      storeName,
      adminEmail,
      currency,
      shippingFee: Number(shippingFee),
      enableCod,
      maintenanceMode,
      theme: 'dark',
      whatsappNumber,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ storeSettings: payload }),
      });
      if (res.ok) {
        localStorage.setItem('grabAllSettings', JSON.stringify(payload));
        window.dispatchEvent(new Event('settingsUpdated'));
        triggerToast('System settings saved successfully.');
      } else {
        triggerToast('Failed to save system settings to database.');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error saving system settings.');
    }
  };

  return (
    <div className="space-y-8 px-1">
      {/* Page Header */}
      <div>
        <p className="text-[10px] font-mono text-indigo-400/70 uppercase tracking-[0.2em] mb-1">System Control</p>
        <h2 className="text-3xl font-black text-white tracking-tight">
          System Config
          <span className="text-indigo-400">.</span>
        </h2>
        <p className="text-slate-500 text-xs mt-1.5 max-w-sm">
          Manage backend configurations, storefront policies, and system preferences.
        </p>
      </div>

      <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-8 max-w-4xl">
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Configs */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-indigo-400">
                General Info
              </h3>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Store Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className={inputCls}
                  placeholder="GrabAll"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Admin Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className={inputCls}
                  placeholder="admin@graballgoods.com"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">WhatsApp Support Number</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className={inputCls}
                  placeholder="e.g. 8801700000000"
                  required
                />
              </div>
            </div>

            {/* Financial and Logistics */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-indigo-400">
                Billing & Logistics
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Currency Symbol</label>
                  <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className={inputCls}
                    placeholder="৳"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Shipping Fee (৳)</label>
                  <input
                    type="number"
                    value={shippingFee}
                    onChange={(e) => setShippingFee(Number(e.target.value))}
                    className={inputCls}
                    min={0}
                    required
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={enableCod}
                    onChange={(e) => setEnableCod(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/30"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                      Enable Cash On Delivery
                    </span>
                    <span className="text-[10px] text-slate-500">Allow customers to choose COD checkout options.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/30"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                      Store Maintenance Mode
                    </span>
                    <span className="text-[10px] text-slate-500">Lock the storefront display and show maintenance screen.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.05] flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/10"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
