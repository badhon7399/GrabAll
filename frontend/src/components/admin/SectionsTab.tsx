import { useState, useEffect } from 'react';
import type { Product } from '../../types';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';

interface SectionsTabProps {
  products: Product[];
  triggerToast: (msg: string) => void;
}

interface SectionConfig {
  flashSaleProductId?: string;
  bestSellerProductIds?: string[];
  newArrivalProductIds?: string[];
  curatedProductIds?: string[];
  followMovementProductIds?: string[];
}

const inputCls =
  'w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.07] hover:border-white/10 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 rounded-xl text-slate-200 text-xs font-sans placeholder-slate-600 outline-none transition-all duration-200';

export default function SectionsTab({ products, triggerToast }: SectionsTabProps) {
  const { user } = useAuth();
  const [config, setConfig] = useState<SectionConfig>({
    flashSaleProductId: '',
    bestSellerProductIds: [],
    newArrivalProductIds: [],
    curatedProductIds: [],
    followMovementProductIds: [],
  });

  // For product search/selection in Flash Sale
  const [flashSearch, setFlashSearch] = useState('');
  const [showFlashDropdown, setShowFlashDropdown] = useState(false);

  // For product search/selection in Best Sellers
  const [bestSearch, setBestSearch] = useState('');
  const [showBestDropdown, setShowBestDropdown] = useState(false);

  // For product search/selection in New Arrivals
  const [arrivalSearch, setArrivalSearch] = useState('');
  const [showArrivalDropdown, setShowArrivalDropdown] = useState(false);

  // For product search/selection in Curated For You
  const [curatedSearch, setCuratedSearch] = useState('');
  const [showCuratedDropdown, setShowCuratedDropdown] = useState(false);

  // For product search/selection in Follow The Movement
  const [movementSearch, setMovementSearch] = useState('');
  const [showMovementDropdown, setShowMovementDropdown] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/settings`);
        if (res.ok) {
          const data = await res.json();
          if (data.homepageSections) {
            setConfig({
              flashSaleProductId: data.homepageSections.flashSaleProductId || '',
              bestSellerProductIds: data.homepageSections.bestSellerProductIds || [],
              newArrivalProductIds: data.homepageSections.newArrivalProductIds || [],
              curatedProductIds: data.homepageSections.curatedProductIds || [],
              followMovementProductIds: data.homepageSections.followMovementProductIds || [],
            });
            localStorage.setItem('grabAllSectionProducts', JSON.stringify(data.homepageSections));
            window.dispatchEvent(new Event('sectionsUpdated'));
          }
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ homepageSections: config }),
      });
      if (res.ok) {
        localStorage.setItem('grabAllSectionProducts', JSON.stringify(config));
        window.dispatchEvent(new Event('sectionsUpdated'));
        triggerToast('Homepage sections updated successfully.');
      } else {
        triggerToast('Failed to save layout to database.');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error saving layout.');
    }
  };

  const resetSection = async (section: 'flash' | 'best' | 'arrival' | 'curated' | 'movement') => {
    const updated = { ...config };
    if (section === 'flash') {
      updated.flashSaleProductId = '';
    } else if (section === 'best') {
      updated.bestSellerProductIds = [];
    } else if (section === 'arrival') {
      updated.newArrivalProductIds = [];
    } else if (section === 'curated') {
      updated.curatedProductIds = [];
    } else if (section === 'movement') {
      updated.followMovementProductIds = [];
    }
    setConfig(updated);

    try {
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ homepageSections: updated }),
      });
      if (res.ok) {
        localStorage.setItem('grabAllSectionProducts', JSON.stringify(updated));
        window.dispatchEvent(new Event('sectionsUpdated'));
        triggerToast(
          `Reset ${
            section === 'flash'
              ? 'Flash Sale'
              : section === 'best'
              ? 'Best Sellers'
              : section === 'arrival'
              ? 'New Arrivals'
              : section === 'curated'
              ? 'Curated For You'
              : 'Follow The Movement'
          } to default dynamic calculations.`
        );
      } else {
        triggerToast('Failed to reset section in database.');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error resetting section.');
    }
  };

  // Filter products for dropdown listings
  const filteredFlashProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(flashSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(flashSearch.toLowerCase())
  );

  const filteredBestProducts = products.filter(
    (p) =>
      !config.bestSellerProductIds?.includes(p._id) &&
      (p.name.toLowerCase().includes(bestSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(bestSearch.toLowerCase()))
  );

  const filteredArrivalProducts = products.filter(
    (p) =>
      !config.newArrivalProductIds?.includes(p._id) &&
      (p.name.toLowerCase().includes(arrivalSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(arrivalSearch.toLowerCase()))
  );

  const filteredCuratedProducts = products.filter(
    (p) =>
      !config.curatedProductIds?.includes(p._id) &&
      (p.name.toLowerCase().includes(curatedSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(curatedSearch.toLowerCase()))
  );

  const filteredMovementProducts = products.filter(
    (p) =>
      !config.followMovementProductIds?.includes(p._id) &&
      (p.name.toLowerCase().includes(movementSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(movementSearch.toLowerCase()))
  );

  // Reordering lists helper
  const moveItem = (section: 'best' | 'arrival' | 'curated' | 'movement', index: number, direction: 'up' | 'down') => {
    const listKey =
      section === 'best'
        ? 'bestSellerProductIds'
        : section === 'arrival'
        ? 'newArrivalProductIds'
        : section === 'curated'
        ? 'curatedProductIds'
        : 'followMovementProductIds';
    const list = [...(config[listKey] || [])];
    if (direction === 'up' && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    }
    setConfig((prev) => ({
      ...prev,
      [listKey]: list,
    }));
  };

  const removeItem = (section: 'best' | 'arrival' | 'curated' | 'movement', id: string) => {
    const listKey =
      section === 'best'
        ? 'bestSellerProductIds'
        : section === 'arrival'
        ? 'newArrivalProductIds'
        : section === 'curated'
        ? 'curatedProductIds'
        : 'followMovementProductIds';
    const list = (config[listKey] || []).filter((item) => item !== id);
    setConfig((prev) => ({
      ...prev,
      [listKey]: list,
    }));
  };

  const addItem = (section: 'best' | 'arrival' | 'curated' | 'movement', id: string) => {
    const listKey =
      section === 'best'
        ? 'bestSellerProductIds'
        : section === 'arrival'
        ? 'newArrivalProductIds'
        : section === 'curated'
        ? 'curatedProductIds'
        : 'followMovementProductIds';
    const list = [...(config[listKey] || []), id];
    setConfig((prev) => ({
      ...prev,
      [listKey]: list,
    }));
    if (section === 'best') {
      setBestSearch('');
      setShowBestDropdown(false);
    } else if (section === 'arrival') {
      setArrivalSearch('');
      setShowArrivalDropdown(false);
    } else if (section === 'curated') {
      setCuratedSearch('');
      setShowCuratedDropdown(false);
    } else if (section === 'movement') {
      setMovementSearch('');
      setShowMovementDropdown(false);
    }
  };

  // Find products based on current configuration
  const currentFlashProduct = products.find((p) => p._id === config.flashSaleProductId);
  const currentBestProducts = (config.bestSellerProductIds || [])
    .map((id) => products.find((p) => p._id === id))
    .filter(Boolean) as Product[];
  const currentArrivalProducts = (config.newArrivalProductIds || [])
    .map((id) => products.find((p) => p._id === id))
    .filter(Boolean) as Product[];
  const currentCuratedProducts = (config.curatedProductIds || [])
    .map((id) => products.find((p) => p._id === id))
    .filter(Boolean) as Product[];
  const currentMovementProducts = (config.followMovementProductIds || [])
    .map((id) => products.find((p) => p._id === id))
    .filter(Boolean) as Product[];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[10px] font-mono text-indigo-400/70 uppercase tracking-[0.2em] mb-1">
            Storefront Config
          </p>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Section Manager
            <span className="text-indigo-400">.</span>
          </h2>
          <p className="text-slate-500 text-xs mt-1.5 max-w-sm">
            Control which products are featured in each homepage content block.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">save</span>
          Save Layout
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* 1. Flash Sale Featured Product */}
        <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-500 text-[18px]">bolt</span>
              Flash Sale (Featured Banner)
            </h3>
            {config.flashSaleProductId && (
              <button
                type="button"
                onClick={() => resetSection('flash')}
                className="text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                Reset to Default
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-3 relative">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Featured Product
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={flashSearch}
                  onChange={(e) => {
                    setFlashSearch(e.target.value);
                    setShowFlashDropdown(true);
                  }}
                  onFocus={() => setShowFlashDropdown(true)}
                  className={inputCls}
                />
                {showFlashDropdown && (
                  <div className="absolute left-0 right-0 mt-1 bg-[#161821] border border-white/10 rounded-xl max-h-60 overflow-y-auto z-30 shadow-2xl">
                    {filteredFlashProducts.length === 0 ? (
                      <p className="p-3 text-[11px] text-slate-500 italic">No products found</p>
                    ) : (
                      filteredFlashProducts.map((p) => (
                        <button
                          key={p._id}
                          type="button"
                          onClick={() => {
                            setConfig((prev) => ({ ...prev, flashSaleProductId: p._id }));
                            setShowFlashDropdown(false);
                            setFlashSearch('');
                          }}
                          className="w-full flex items-center gap-3 p-2.5 hover:bg-white/[0.03] text-left border-b border-white/5 last:border-0"
                        >
                          <img src={p.image} className="w-8 h-8 rounded-lg object-cover bg-slate-900" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white truncate font-bold">{p.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              ৳{p.salePrice} · {p.category}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              {showFlashDropdown && (
                <div className="fixed inset-0 z-20" onClick={() => setShowFlashDropdown(false)} />
              )}
            </div>

            <div className="bg-white/[0.01] border border-dashed border-white/5 rounded-2xl p-4 min-h-[100px] flex items-center justify-center">
              {currentFlashProduct ? (
                <div className="flex gap-4 items-center w-full">
                  <img
                    src={currentFlashProduct.image}
                    className="w-20 h-20 rounded-xl object-cover bg-slate-900 shadow-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-bold uppercase tracking-wider">
                      Featured
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1.5 truncate">{currentFlashProduct.name}</h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">৳{currentFlashProduct.salePrice}</p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Category: {currentFlashProduct.category}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <span className="material-symbols-outlined text-slate-600 text-2xl">auto_awesome</span>
                  <p className="text-xs text-slate-500 mt-1">Default (Auto-picks first listed product)</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Best Sellers Custom List */}
        <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0088FF] text-[18px]">military_tech</span>
              Best Sellers List (Manual Control)
            </h3>
            {config.bestSellerProductIds && config.bestSellerProductIds.length > 0 && (
              <button
                type="button"
                onClick={() => resetSection('best')}
                className="text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                Reset to Default
              </button>
            )}
          </div>

          <div className="space-y-4 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products to add to Best Sellers..."
                value={bestSearch}
                onChange={(e) => {
                  setBestSearch(e.target.value);
                  setShowBestDropdown(true);
                }}
                onFocus={() => setShowBestDropdown(true)}
                className={inputCls}
              />
              {showBestDropdown && (
                <div className="absolute left-0 right-0 mt-1 bg-[#161821] border border-white/10 rounded-xl max-h-60 overflow-y-auto z-30 shadow-2xl">
                  {filteredBestProducts.length === 0 ? (
                    <p className="p-3 text-[11px] text-slate-500 italic">No products found</p>
                  ) : (
                    filteredBestProducts.map((p) => (
                      <button
                        key={p._id}
                        type="button"
                        onClick={() => addItem('best', p._id)}
                        className="w-full flex items-center gap-3 p-2.5 hover:bg-white/[0.03] text-left border-b border-white/5 last:border-0"
                      >
                        <img src={p.image} className="w-8 h-8 rounded-lg object-cover bg-slate-900" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white truncate font-bold">{p.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            ৳{p.salePrice} · {p.category}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            {showBestDropdown && (
              <div className="fixed inset-0 z-20" onClick={() => setShowBestDropdown(false)} />
            )}

            {currentBestProducts.length === 0 ? (
              <div className="py-8 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-2xl">
                <span className="material-symbols-outlined text-slate-600 text-3xl">auto_stories</span>
                <p className="text-xs text-slate-500 mt-2">
                  Dynamic (Currently auto-calculated by high stock level)
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
                {currentBestProducts.map((p, idx) => (
                  <div
                    key={p._id}
                    className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all group"
                  >
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400 flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <img src={p.image} className="w-12 h-12 rounded-lg object-cover bg-slate-900" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        ৳{p.salePrice} · {p.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => moveItem('best', idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem('best', idx, 'down')}
                        disabled={idx === currentBestProducts.length - 1}
                        className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem('best', p._id)}
                        className="p-1 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 rounded"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3. New Arrivals Custom List */}
        <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-400 text-[18px]">celebration</span>
              New Arrivals List (Manual Control)
            </h3>
            {config.newArrivalProductIds && config.newArrivalProductIds.length > 0 && (
              <button
                type="button"
                onClick={() => resetSection('arrival')}
                className="text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                Reset to Default
              </button>
            )}
          </div>

          <div className="space-y-4 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products to add to New Arrivals..."
                value={arrivalSearch}
                onChange={(e) => {
                  setArrivalSearch(e.target.value);
                  setShowArrivalDropdown(true);
                }}
                onFocus={() => setShowArrivalDropdown(true)}
                className={inputCls}
              />
              {showArrivalDropdown && (
                <div className="absolute left-0 right-0 mt-1 bg-[#161821] border border-white/10 rounded-xl max-h-60 overflow-y-auto z-30 shadow-2xl">
                  {filteredArrivalProducts.length === 0 ? (
                    <p className="p-3 text-[11px] text-slate-500 italic">No products found</p>
                  ) : (
                    filteredArrivalProducts.map((p) => (
                      <button
                        key={p._id}
                        type="button"
                        onClick={() => addItem('arrival', p._id)}
                        className="w-full flex items-center gap-3 p-2.5 hover:bg-white/[0.03] text-left border-b border-white/5 last:border-0"
                      >
                        <img src={p.image} className="w-8 h-8 rounded-lg object-cover bg-slate-900" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white truncate font-bold">{p.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            ৳{p.salePrice} · {p.category}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            {showArrivalDropdown && (
              <div className="fixed inset-0 z-20" onClick={() => setShowArrivalDropdown(false)} />
            )}

            {currentArrivalProducts.length === 0 ? (
              <div className="py-8 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-2xl">
                <span className="material-symbols-outlined text-slate-600 text-3xl">new_releases</span>
                <p className="text-xs text-slate-500 mt-2">
                  Dynamic (Currently auto-calculated by latest creation date)
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
                {currentArrivalProducts.map((p, idx) => (
                  <div
                    key={p._id}
                    className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all group"
                  >
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400 flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <img src={p.image} className="w-12 h-12 rounded-lg object-cover bg-slate-900" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        ৳{p.salePrice} · {p.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => moveItem('arrival', idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem('arrival', idx, 'down')}
                        disabled={idx === currentArrivalProducts.length - 1}
                        className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem('arrival', p._id)}
                        className="p-1 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 rounded"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4. Curated For You Custom List */}
        <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-400 text-[18px]">auto_awesome</span>
              Curated For You List (Manual Control)
            </h3>
            {config.curatedProductIds && config.curatedProductIds.length > 0 && (
              <button
                type="button"
                onClick={() => resetSection('curated')}
                className="text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                Reset to Default
              </button>
            )}
          </div>

          <div className="space-y-4 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products to add to Curated For You..."
                value={curatedSearch}
                onChange={(e) => {
                  setCuratedSearch(e.target.value);
                  setShowCuratedDropdown(true);
                }}
                onFocus={() => setShowCuratedDropdown(true)}
                className={inputCls}
              />
              {showCuratedDropdown && (
                <div className="absolute left-0 right-0 mt-1 bg-[#161821] border border-white/10 rounded-xl max-h-60 overflow-y-auto z-30 shadow-2xl">
                  {filteredCuratedProducts.length === 0 ? (
                    <p className="p-3 text-[11px] text-slate-500 italic">No products found</p>
                  ) : (
                    filteredCuratedProducts.map((p) => (
                      <button
                        key={p._id}
                        type="button"
                        onClick={() => addItem('curated', p._id)}
                        className="w-full flex items-center gap-3 p-2.5 hover:bg-white/[0.03] text-left border-b border-white/5 last:border-0"
                      >
                        <img src={p.image} className="w-8 h-8 rounded-lg object-cover bg-slate-900" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white truncate font-bold">{p.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            ৳{p.salePrice} · {p.category}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            {showCuratedDropdown && (
              <div className="fixed inset-0 z-20" onClick={() => setShowCuratedDropdown(false)} />
            )}

            {currentCuratedProducts.length === 0 ? (
              <div className="py-8 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-2xl">
                <span className="material-symbols-outlined text-slate-600 text-3xl">favorite</span>
                <p className="text-xs text-slate-500 mt-2">
                  Dynamic (Currently auto-calculated by default catalog list)
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
                {currentCuratedProducts.map((p, idx) => (
                  <div
                    key={p._id}
                    className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all group"
                  >
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400 flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <img src={p.image} className="w-12 h-12 rounded-lg object-cover bg-slate-900" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        ৳{p.salePrice} · {p.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => moveItem('curated', idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem('curated', idx, 'down')}
                        disabled={idx === currentCuratedProducts.length - 1}
                        className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem('curated', p._id)}
                        className="p-1 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 rounded"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 5. Follow The Movement Custom List */}
        <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-400 text-[18px]">photo_camera</span>
              Follow The Movement List (Manual Control)
            </h3>
            {config.followMovementProductIds && config.followMovementProductIds.length > 0 && (
              <button
                type="button"
                onClick={() => resetSection('movement')}
                className="text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                Reset to Default
              </button>
            )}
          </div>

          <div className="space-y-4 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products to add to Follow The Movement..."
                value={movementSearch}
                onChange={(e) => {
                  setMovementSearch(e.target.value);
                  setShowMovementDropdown(true);
                }}
                onFocus={() => setShowMovementDropdown(true)}
                className={inputCls}
              />
              {showMovementDropdown && (
                <div className="absolute left-0 right-0 mt-1 bg-[#161821] border border-white/10 rounded-xl max-h-60 overflow-y-auto z-30 shadow-2xl">
                  {filteredMovementProducts.length === 0 ? (
                    <p className="p-3 text-[11px] text-slate-500 italic">No products found</p>
                  ) : (
                    filteredMovementProducts.map((p) => (
                      <button
                        key={p._id}
                        type="button"
                        onClick={() => addItem('movement', p._id)}
                        className="w-full flex items-center gap-3 p-2.5 hover:bg-white/[0.03] text-left border-b border-white/5 last:border-0"
                      >
                        <img src={p.image} className="w-8 h-8 rounded-lg object-cover bg-slate-900" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white truncate font-bold">{p.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            ৳{p.salePrice} · {p.category}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            {showMovementDropdown && (
              <div className="fixed inset-0 z-20" onClick={() => setShowMovementDropdown(false)} />
            )}

            {currentMovementProducts.length === 0 ? (
              <div className="py-8 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-2xl">
                <span className="material-symbols-outlined text-slate-600 text-3xl">photo_camera</span>
                <p className="text-xs text-slate-500 mt-2">
                  Dynamic (Currently auto-calculated by default catalog list)
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
                {currentMovementProducts.map((p, idx) => (
                  <div
                    key={p._id}
                    className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all group"
                  >
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400 flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <img src={p.image} className="w-12 h-12 rounded-lg object-cover bg-slate-900" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        ৳{p.salePrice} · {p.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => moveItem('movement', idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem('movement', idx, 'down')}
                        disabled={idx === currentMovementProducts.length - 1}
                        className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem('movement', p._id)}
                        className="p-1 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 rounded"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
