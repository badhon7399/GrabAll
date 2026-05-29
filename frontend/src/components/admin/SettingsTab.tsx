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
  const [faqs, setFaqs] = useState<{
    question: { en: string; bn: string };
    answer: { en: string; bn: string };
  }[]>([]);

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
          if (data.faqs) {
            setFaqs(data.faqs);
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

  const handleSaveFaqs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ faqs }),
      });
      if (res.ok) {
        triggerToast('FAQs saved successfully.');
      } else {
        triggerToast('Failed to save FAQs.');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error saving FAQs.');
    }
  };

  const addFaq = () => {
    setFaqs([...faqs, {
      question: { en: '', bn: '' },
      answer: { en: '', bn: '' }
    }]);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const moveFaq = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === faqs.length - 1) return;
    const newFaqs = [...faqs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newFaqs[index];
    newFaqs[index] = newFaqs[targetIndex];
    newFaqs[targetIndex] = temp;
    setFaqs(newFaqs);
  };

  const updateFaq = (index: number, field: 'question' | 'answer', lang: 'en' | 'bn', val: string) => {
    const newFaqs = [...faqs];
    newFaqs[index] = {
      ...newFaqs[index],
      [field]: {
        ...newFaqs[index][field],
        [lang]: val
      }
    };
    setFaqs(newFaqs);
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

      {/* FAQ Manager */}
      <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-8 max-w-4xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-indigo-400">
              Store FAQs Manager
            </h3>
            <p className="text-slate-500 text-[10px] mt-1">
              Add, update, or remove Frequently Asked Questions displayed on the homepage.
            </p>
          </div>
          <button
            type="button"
            onClick={addFaq}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add New FAQ
          </button>
        </div>

        {faqs.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-white/[0.05] rounded-xl text-slate-500 text-xs">
            No FAQs configured. Click "Add New FAQ" to create one.
          </div>
        ) : (
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 bg-white/[0.01] border border-white/[0.04] rounded-xl space-y-4 relative group"
              >
                {/* Control Actions (Top Right) */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {/* Re-order up */}
                  <button
                    type="button"
                    onClick={() => moveFaq(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.05] transition-colors cursor-pointer"
                    title="Move Up"
                  >
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  </button>
                  {/* Re-order down */}
                  <button
                    type="button"
                    onClick={() => moveFaq(idx, 'down')}
                    disabled={idx === faqs.length - 1}
                    className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.05] transition-colors cursor-pointer"
                    title="Move Down"
                  >
                    <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                  </button>
                  {/* Delete FAQ */}
                  <button
                    type="button"
                    onClick={() => removeFaq(idx)}
                    className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500 transition-colors cursor-pointer"
                    title="Delete FAQ"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                  </button>
                </div>

                {/* FAQ Fields */}
                <div className="pr-24 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* English Question */}
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                      Question (English)
                    </label>
                    <input
                      type="text"
                      value={faq.question.en}
                      onChange={(e) => updateFaq(idx, 'question', 'en', e.target.value)}
                      className={inputCls}
                      placeholder="e.g. Do you offer Cash on Delivery?"
                      required
                    />
                  </div>
                  {/* Bengali Question */}
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                      Question (Bengali / বাংলা)
                    </label>
                    <input
                      type="text"
                      value={faq.question.bn}
                      onChange={(e) => updateFaq(idx, 'question', 'bn', e.target.value)}
                      className={inputCls}
                      placeholder="যেমন: আপনারা কি ক্যাশ অন ডেলিভারি দেন?"
                      required
                    />
                  </div>

                  {/* English Answer */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                      Answer (English)
                    </label>
                    <textarea
                      value={faq.answer.en}
                      onChange={(e) => updateFaq(idx, 'answer', 'en', e.target.value)}
                      className="w-full px-4 py-2 bg-white/[0.03] border border-white/[0.07] hover:border-white/10 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 rounded-xl text-slate-200 text-xs font-sans placeholder-slate-600 outline-none transition-all duration-200 min-h-[60px] resize-y"
                      placeholder="Provide answer description in English..."
                      required
                    />
                  </div>

                  {/* Bengali Answer */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                      Answer (Bengali / বাংলা)
                    </label>
                    <textarea
                      value={faq.answer.bn}
                      onChange={(e) => updateFaq(idx, 'answer', 'bn', e.target.value)}
                      className="w-full px-4 py-2 bg-white/[0.03] border border-white/[0.07] hover:border-white/10 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 rounded-xl text-slate-200 text-xs font-sans placeholder-slate-600 outline-none transition-all duration-200 min-h-[60px] resize-y"
                      placeholder="বাংলায় উত্তর প্রদান করুন..."
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-white/[0.05] flex justify-end">
          <button
            type="button"
            onClick={handleSaveFaqs}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
          >
            Save FAQs Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
