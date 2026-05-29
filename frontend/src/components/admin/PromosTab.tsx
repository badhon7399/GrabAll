import React, { useState, useEffect } from 'react';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';

const inputCls =
  'w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.07] hover:border-white/10 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 rounded-xl text-slate-200 text-xs font-sans placeholder-slate-600 outline-none transition-all duration-200';

export interface PromoCode {
  _id: string;
  code: string;
  discount: number;
  isActive: boolean;
  createdAt?: string;
}

export default function PromosTab({ triggerToast }: { triggerToast: (msg: string) => void }) {
  const { user } = useAuth();
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState(10);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/promos/admin`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setPromos(data);
        }
      } catch (err) {
        console.error('Error fetching promos:', err);
      }
    };
    if (user?.token) {
      fetchPromos();
    }
  }, [user]);

  const handleAddPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      triggerToast('Please enter a promo code name.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/promos/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          discount: Number(discount),
          isActive: true,
        }),
      });

      if (res.ok) {
        const newPromo = await res.json();
        setPromos([newPromo, ...promos]);
        setCode('');
        setDiscount(10);
        triggerToast(`Promo code ${newPromo.code} added.`);
      } else {
        const errData = await res.json();
        triggerToast(errData.message || 'Error adding promo code');
      }
    } catch (err) {
      console.error('Error saving promo to database:', err);
      triggerToast('Error saving promo to database.');
    }
  };

  const handleTogglePromo = async (promo: PromoCode) => {
    try {
      const res = await fetch(`${API_BASE_URL}/promos/admin/${promo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ isActive: !promo.isActive }),
      });

      if (res.ok) {
        const updated = await res.json();
        setPromos(promos.map((p) => (p._id === promo._id ? updated : p)));
        triggerToast('Promo code status toggled.');
      } else {
        const errData = await res.json();
        triggerToast(errData.message || 'Error updating status');
      }
    } catch (err) {
      console.error('Error toggling status:', err);
      triggerToast('Error toggling status.');
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this promo code?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/promos/admin/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (res.ok) {
          setPromos(promos.filter((p) => p._id !== id));
          triggerToast('Promo code deleted.');
        } else {
          const errData = await res.json();
          triggerToast(errData.message || 'Error deleting promo');
        }
      } catch (err) {
        console.error('Error deleting promo:', err);
        triggerToast('Error deleting promo.');
      }
    }
  };

  return (
    <div className="space-y-8 px-1">
      {/* Page Header */}
      <div>
        <p className="text-[10px] font-mono text-indigo-400/70 uppercase tracking-[0.2em] mb-1">Coupon Config</p>
        <h2 className="text-3xl font-black text-white tracking-tight">
          Promo Setup
          <span className="text-indigo-400">.</span>
        </h2>
        <p className="text-slate-500 text-xs mt-1.5 max-w-sm">
          Set up discount coupon codes that customers can apply at checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Create Form */}
        <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6 space-y-4 xl:col-span-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-400 text-[18px]">add_circle</span>
            New Code
          </h3>
          <form onSubmit={handleAddPromo} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="promo-code-name" className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Promo Code Name</label>
              <input
                id="promo-code-name"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={inputCls}
                placeholder="e.g. SUMMER50"
                aria-label="Promo Code Name"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="promo-discount" className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                Discount Percentage (%)
              </label>
              <input
                id="promo-discount"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className={inputCls}
                min={1}
                max={100}
                aria-label="Discount Percentage (%)"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              Add Promo Code
            </button>
          </form>
        </div>

        {/* List of Active Promos */}
        <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6 space-y-4 xl:col-span-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-400 text-[18px]">local_offer</span>
            Active Promo Codes ({promos.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.05] text-slate-500 font-mono text-[9px] uppercase tracking-wider">
                  <th className="py-3 px-2">Code</th>
                  <th className="py-3 px-2">Type</th>
                  <th className="py-3 px-2">Value</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {promos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-slate-600 font-mono">
                      No promo codes configured.
                    </td>
                  </tr>
                ) : (
                  promos.map((p) => (
                    <tr key={p._id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3 px-2 font-mono font-bold text-indigo-400">{p.code}</td>
                      <td className="py-3 px-2 text-slate-300 font-sans">Percentage</td>
                      <td className="py-3 px-2 font-bold text-slate-100">{p.discount}%</td>
                      <td className="py-3 px-2">
                        <button
                          onClick={() => handleTogglePromo(p)}
                          aria-label={`Toggle active status for ${p.code}`}
                          className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500/50 ${
                            p.isActive
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                          }`}
                        >
                          {p.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </button>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => handleDeletePromo(p._id)}
                          aria-label={`Delete promo code ${p.code}`}
                          className="p-1 rounded hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors focus:outline-none focus:ring-1 focus:ring-rose-500/50"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
