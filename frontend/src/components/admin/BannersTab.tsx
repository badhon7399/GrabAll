import { useState, useEffect, useRef } from 'react';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';

const inputCls =
  'w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.07] hover:border-white/10 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 rounded-xl text-slate-200 text-xs font-sans placeholder-slate-600 outline-none transition-all duration-200';

interface Banner {
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  badge?: string;
}

export default function BannersTab({ triggerToast }: { triggerToast: (msg: string) => void }) {
  const { user } = useAuth();
  const [logoUrl, setLogoUrl] = useState('https://raw.githubusercontent.com/shadcn.png');
  const [banners, setBanners] = useState<Banner[]>([]);
  
  // Banner Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSub, setBannerSub] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [badgeText, setBadgeText] = useState('');

  // Announcement Bar States
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [editingAnnIndex, setEditingAnnIndex] = useState<number | null>(null);

  // Promotions State
  const [promo1, setPromo1] = useState({
    badge: 'New Arrivals',
    title: 'Upgrade Your Gear.',
    desc: 'Discover professional-grade tools for creators who demand the best.',
    ctaText: 'Shop Creator Gear',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=600',
    categoryTarget: 'Content Gear'
  });
  const [promo2, setPromo2] = useState({
    badge: 'Bundle & Save',
    title: 'Creator Starter Kits',
    desc: 'Save up to 25% when you bundle mic + mount + power bank.',
    ctaText: 'Build Your Kit',
    bgGradientFrom: '#9333ea',
    bgGradientTo: '#4f46e5',
    categoryTarget: 'All'
  });
  const [promo1Uploading, setPromo1Uploading] = useState(false);
  const promo1InputRef = useRef<HTMLInputElement>(null);

  // Upload state
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);

  // Preview index for mockup
  const [previewIndex, setPreviewIndex] = useState(0);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Categories Manager State
  interface CategoryItem {
    name: string;
    image: string;
  }
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catEditingIndex, setCatEditingIndex] = useState<number | null>(null);
  const [catFormOpen, setCatFormOpen] = useState(false);
  const [catUploading, setCatUploading] = useState(false);
  const catInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/settings`);
        if (res.ok) {
          const data = await res.json();
          if (data.logo) {
            setLogoUrl(data.logo);
            localStorage.setItem('grabAllLogo', data.logo);
          }
          if (data.banners) {
            setBanners(data.banners);
            localStorage.setItem('grabAllBanners', JSON.stringify(data.banners));
          }
          if (data.announcements) {
            setAnnouncements(data.announcements);
            localStorage.setItem('grabAllAnnouncements', JSON.stringify(data.announcements));
          }
          if (data.promotions) {
            if (data.promotions.promo1) setPromo1(data.promotions.promo1);
            if (data.promotions.promo2) setPromo2(data.promotions.promo2);
            localStorage.setItem('grabAllPromotions', JSON.stringify(data.promotions));
          }
          if (data.categories) {
            setCategories(data.categories);
            localStorage.setItem('grabAllCategories', JSON.stringify(data.categories));
          } else {
            setCategories([
              { name: 'Content Gear', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600' },
              { name: 'Microphones', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600' },
              { name: 'Power Banks', image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&q=80&w=600' },
              { name: 'Neck Mounts', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600' },
              { name: 'Smart Finder', image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=600' },
              { name: 'Daily Deals', image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600' },
            ]);
          }
          window.dispatchEvent(new Event('storage'));
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleSavePromotions = async (p1: typeof promo1, p2: typeof promo2) => {
    try {
      const payload = {
        promotions: {
          promo1: p1,
          promo2: p2
        }
      };
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        localStorage.setItem('grabAllPromotions', JSON.stringify(payload.promotions));
        window.dispatchEvent(new Event('promotionsUpdated'));
        triggerToast('Promotional cards updated successfully.');
      } else {
        triggerToast('Failed to update promotional cards.');
      }
    } catch (err) {
      console.error('Error saving promotions:', err);
      triggerToast('Error saving promotions.');
    }
  };

  const handlePromo1Upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      triggerToast('File is too large. Max size is 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setPromo1Uploading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to upload image.');
      }

      if (!data.url) {
        throw new Error('Server returned empty image URL. Please try again.');
      }

      setPromo1(prev => ({ ...prev, image: data.url }));
      triggerToast('Promotional card image uploaded successfully.');
    } catch (err: any) {
      console.error(err);
      triggerToast(err.message || 'Failed to upload image.');
    } finally {
      setPromo1Uploading(false);
    }
  };

  const syncSettingsWithBackend = async (payload: any): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('Failed to sync settings with database:', errData);
        triggerToast('⚠️ Failed to save to database. Changes are local only and will be lost on reload.');
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error syncing settings:', err);
      triggerToast('⚠️ Cannot reach the server. Changes are local only and will be lost on reload.');
      return false;
    }
  };

  const saveAllCategories = (updatedList: CategoryItem[]) => {
    setCategories(updatedList);
    localStorage.setItem('grabAllCategories', JSON.stringify(updatedList));
    window.dispatchEvent(new Event('categoriesUpdated'));
    window.dispatchEvent(new Event('storage'));
    syncSettingsWithBackend({ categories: updatedList });
  };

  const handleAddCategoryClick = () => {
    setCatEditingIndex(null);
    setCatName('');
    setCatImage('https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600');
    setCatFormOpen(true);
  };

  const handleEditCategoryClick = (idx: number) => {
    const cat = categories[idx];
    setCatEditingIndex(idx);
    setCatName(cat.name);
    setCatImage(cat.image);
    setCatFormOpen(true);
  };

  const handleDeleteCategoryClick = (idx: number) => {
    const updated = categories.filter((_, i) => i !== idx);
    saveAllCategories(updated);
    triggerToast('Category deleted successfully.');
  };

  const handleMoveCategory = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === categories.length - 1) return;

    const newIndex = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...categories];
    const temp = updated[idx];
    updated[idx] = updated[newIndex];
    updated[newIndex] = temp;

    saveAllCategories(updated);
    triggerToast('Category order updated.');
  };

  const handleCatFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      triggerToast('Category name is required.');
      return;
    }

    const payload: CategoryItem = {
      name: catName.trim(),
      image: catImage.trim() || 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600',
    };

    let updated: CategoryItem[];
    if (catEditingIndex !== null) {
      updated = categories.map((c, i) => (i === catEditingIndex ? payload : c));
      triggerToast('Category updated successfully.');
    } else {
      updated = [...categories, payload];
      triggerToast('Category added successfully.');
    }

    saveAllCategories(updated);
    setCatFormOpen(false);
  };

  const handleCatUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      triggerToast('File is too large. Max size is 2MB for category logo.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setCatUploading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to upload category image.');
      }

      if (!data.url) {
        throw new Error('Server returned empty image URL. Please try again.');
      }

      setCatImage(data.url);
      triggerToast('Category logo uploaded successfully.');
    } catch (err: any) {
      console.error(err);
      triggerToast(err.message || 'Failed to upload category image.');
    } finally {
      setCatUploading(false);
    }
  };

  const handleSaveAnnouncements = (updatedList: string[]) => {
    setAnnouncements(updatedList);
    localStorage.setItem('grabAllAnnouncements', JSON.stringify(updatedList));
    window.dispatchEvent(new Event('storage'));
    syncSettingsWithBackend({ announcements: updatedList });
  };

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.trim()) return;
    let updated: string[];
    if (editingAnnIndex !== null) {
      updated = announcements.map((ann, i) => (i === editingAnnIndex ? newAnnouncement.trim() : ann));
      setEditingAnnIndex(null);
      triggerToast('Announcement updated.');
    } else {
      updated = [...announcements, newAnnouncement.trim()];
      triggerToast('Announcement added.');
    }
    handleSaveAnnouncements(updated);
    setNewAnnouncement('');
  };

  const handleEditAnnouncement = (idx: number) => {
    setNewAnnouncement(announcements[idx]);
    setEditingAnnIndex(idx);
  };

  const handleDeleteAnnouncement = (idx: number) => {
    const updated = announcements.filter((_, i) => i !== idx);
    handleSaveAnnouncements(updated);
    triggerToast('Announcement deleted.');
  };

  const handleSaveLogo = () => {
    localStorage.setItem('grabAllLogo', logoUrl);
    window.dispatchEvent(new Event('logoUpdated'));
    triggerToast('Logo updated successfully.');
    syncSettingsWithBackend({ logo: logoUrl });
  };

  const saveAllBanners = (updatedList: Banner[]) => {
    setBanners(updatedList);
    localStorage.setItem('grabAllBanners', JSON.stringify(updatedList));
    window.dispatchEvent(new Event('bannersUpdated'));
    syncSettingsWithBackend({ banners: updatedList });
  };

  const handleAddClick = () => {
    setEditingIndex(null);
    setBannerTitle('');
    setBannerSub('');
    setBannerImage('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=1200');
    setCtaText('Explore Collection');
    setBadgeText('Featured');
    setIsFormOpen(true);
  };

  const handleEditClick = (idx: number) => {
    const b = banners[idx];
    setEditingIndex(idx);
    setBannerTitle(b.title || '');
    setBannerSub(b.subtitle || b.subtitle || '');
    setBannerImage(b.image || '');
    setCtaText(b.ctaText || '');
    setBadgeText(b.badge || 'Featured');
    setIsFormOpen(true);
  };

  const handleDeleteClick = (idx: number) => {
    const updated = banners.filter((_, i) => i !== idx);
    saveAllBanners(updated);
    if (previewIndex >= updated.length && updated.length > 0) {
      setPreviewIndex(updated.length - 1);
    }
    triggerToast('Banner deleted successfully.');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Banner = {
      title: bannerTitle,
      subtitle: bannerSub,
      image: bannerImage,
      ctaText,
      badge: badgeText,
    };

    let updated: Banner[];
    if (editingIndex !== null) {
      updated = banners.map((b, i) => (i === editingIndex ? payload : b));
      triggerToast('Banner updated successfully.');
    } else {
      updated = [...banners, payload];
      triggerToast('Banner added successfully.');
    }

    saveAllBanners(updated);
    setIsFormOpen(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      triggerToast('File is too large. Max size is 2MB for logo.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setLogoUploading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to upload logo.');
      }

      if (!data.url) {
        throw new Error('Server returned empty image URL. Please try again.');
      }

      setLogoUrl(data.url);
      triggerToast('Logo image uploaded successfully.');
    } catch (err: any) {
      console.error(err);
      triggerToast(err.message || 'Failed to upload logo.');
    } finally {
      setLogoUploading(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      triggerToast('File is too large. Max size is 5MB for banner.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setBannerUploading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to upload banner.');
      }

      if (!data.url) {
        throw new Error('Server returned empty image URL. Please try again.');
      }

      setBannerImage(data.url);
      triggerToast('Banner image uploaded successfully.');
    } catch (err: any) {
      console.error(err);
      triggerToast(err.message || 'Failed to upload banner.');
    } finally {
      setBannerUploading(false);
    }
  };

  return (
    <div className="space-y-8 px-1">
      {/* Page Header */}
      <div>
        <p className="text-[10px] font-mono text-indigo-400/70 uppercase tracking-[0.2em] mb-1">Branding Config</p>
        <h2 className="text-3xl font-black text-white tracking-tight">
          Banners & Logo
          <span className="text-indigo-400">.</span>
        </h2>
        <p className="text-slate-500 text-xs mt-1.5 max-w-sm">
          Modify the brand presence, landing page hero banner, and primary storefront logos.
        </p>
      </div>

      <div className="max-w-4xl space-y-6">
          {/* Logo Card */}
          <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-400 text-[18px]">verified_user</span>
              Storefront Logo
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-slate-600">image</span>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Logo Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className={inputCls}
                      placeholder="https://..."
                    />
                    <input
                      type="file"
                      ref={logoInputRef}
                      onChange={handleLogoUpload}
                      className="hidden"
                      accept="image/*"
                    />
                    <button
                      type="button"
                      disabled={logoUploading}
                      onClick={() => logoInputRef.current?.click()}
                      className="px-4 py-2.5 bg-indigo-600/20 hover:bg-indigo-500/30 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                    >
                      {logoUploading ? 'Uploading…' : 'Upload'}
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSaveLogo}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/10"
              >
                Update Logo
              </button>
            </div>
          </div>

          {/* Announcement Bar Customization */}
          <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-400 text-[18px]">campaign</span>
              Announcement Bar Messages
            </h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAnnouncement}
                  onChange={(e) => setNewAnnouncement(e.target.value)}
                  className={inputCls}
                  placeholder="e.g. 🚚 Free Shipping over 4,000 BDT"
                />
                <button
                  type="button"
                  onClick={handleAddAnnouncement}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all whitespace-nowrap"
                >
                  {editingAnnIndex !== null ? 'Update' : 'Add'}
                </button>
              </div>

              {announcements.length === 0 ? (
                <p className="text-slate-500 text-[11px] italic">No announcements configured.</p>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {announcements.map((ann, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all group"
                    >
                      <span className="text-slate-300 text-xs truncate max-w-[280px]">{ann}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleEditAnnouncement(idx)}
                          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-all"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[14px]">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAnnouncement(idx)}
                          className="p-1 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 rounded transition-all"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Categories Management Card */}
          <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-400 text-[18px]">category</span>
                Homepage Category Logos
              </h3>
              {!catFormOpen && (
                <button
                  onClick={handleAddCategoryClick}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 shadow-md shadow-indigo-600/10"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  Add Category
                </button>
              )}
            </div>

            {catFormOpen ? (
              <form onSubmit={handleCatFormSubmit} className="space-y-4 border-t border-white/5 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold text-indigo-400 font-mono uppercase tracking-wider">
                    {catEditingIndex !== null ? `Edit Category #${catEditingIndex + 1}` : 'New Category Details'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setCatFormOpen(false)}
                    className="text-slate-500 hover:text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category Name</label>
                    <input
                      type="text"
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      className={inputCls}
                      placeholder="e.g. Smart Watch"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Logo URL / Upload Image</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={catImage}
                        onChange={(e) => setCatImage(e.target.value)}
                        className={inputCls}
                        placeholder="Image URL"
                      />
                      <button
                        type="button"
                        onClick={() => catInputRef.current?.click()}
                        disabled={catUploading}
                        className="px-3 bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-bold rounded-xl transition-all border border-white/10 flex items-center justify-center whitespace-nowrap min-w-[70px]"
                      >
                        {catUploading ? '...' : 'Upload'}
                      </button>
                      <input
                        type="file"
                        ref={catInputRef}
                        onChange={handleCatUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/10"
                  >
                    {catEditingIndex !== null ? 'Save Changes' : 'Create Category'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2 border-t border-white/5 pt-4">
                {categories.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No categories configured. Using defaults.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categories.map((cat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-900 flex-shrink-0 border border-white/10">
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{cat.name}</h4>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleMoveCategory(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded disabled:opacity-30 disabled:hover:bg-slate-800 disabled:hover:text-slate-400 transition-all"
                            title="Move Up"
                          >
                            <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                          </button>
                          <button
                            onClick={() => handleMoveCategory(idx, 'down')}
                            disabled={idx === categories.length - 1}
                            className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded disabled:opacity-30 disabled:hover:bg-slate-800 disabled:hover:text-slate-400 transition-all"
                            title="Move Down"
                          >
                            <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                          </button>
                          <button
                            onClick={() => handleEditCategoryClick(idx)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all"
                            title="Edit Category"
                          >
                            <span className="material-symbols-outlined text-[14px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteCategoryClick(idx)}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-lg transition-all"
                            title="Delete Category"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dual Promotional Cards Customization */}
          <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-400 text-[18px]">ads_click</span>
              Dual Homepage Promotional Cards
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Promo Card Form */}
              <div className="space-y-4 border border-white/5 p-4 rounded-xl bg-white/[0.01]">
                <h4 className="text-xs font-bold text-indigo-400 font-mono uppercase tracking-wider">Left Promotion Card (Image Background)</h4>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Badge Text</label>
                    <input
                      type="text"
                      value={promo1.badge}
                      onChange={(e) => setPromo1({ ...promo1, badge: e.target.value })}
                      className={inputCls}
                      placeholder="e.g. New Arrivals"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Card Title</label>
                    <input
                      type="text"
                      value={promo1.title}
                      onChange={(e) => setPromo1({ ...promo1, title: e.target.value })}
                      className={inputCls}
                      placeholder="e.g. Upgrade Your Gear."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Card Description</label>
                    <textarea
                      value={promo1.desc}
                      onChange={(e) => setPromo1({ ...promo1, desc: e.target.value })}
                      className={`${inputCls} resize-none`}
                      rows={2}
                      placeholder="e.g. Discover professional-grade tools for creators..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">CTA Button Text</label>
                    <input
                      type="text"
                      value={promo1.ctaText}
                      onChange={(e) => setPromo1({ ...promo1, ctaText: e.target.value })}
                      className={inputCls}
                      placeholder="e.g. Shop Creator Gear"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Target Category</label>
                    <input
                      type="text"
                      value={promo1.categoryTarget}
                      onChange={(e) => setPromo1({ ...promo1, categoryTarget: e.target.value })}
                      className={inputCls}
                      placeholder="e.g. Content Gear"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Background Image</label>
                    <div className="flex gap-3 items-start mt-1">
                      <div className="w-14 h-14 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {promo1.image ? (
                          <img src={promo1.image} alt="Promo 1 Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-slate-600">image</span>
                        )}
                      </div>
                      <div className="flex-1 flex gap-2">
                        <input
                          type="url"
                          value={promo1.image}
                          onChange={(e) => setPromo1({ ...promo1, image: e.target.value })}
                          className={inputCls}
                          placeholder="https://..."
                        />
                        <input
                          type="file"
                          ref={promo1InputRef}
                          onChange={handlePromo1Upload}
                          className="hidden"
                          accept="image/*"
                        />
                        <button
                          type="button"
                          disabled={promo1Uploading}
                          onClick={() => promo1InputRef.current?.click()}
                          className="px-3 py-2 bg-indigo-600/20 hover:bg-indigo-500/30 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 text-xs font-bold rounded-xl transition-all whitespace-nowrap disabled:opacity-50"
                        >
                          {promo1Uploading ? 'Uploading…' : 'Upload'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Promo Card Form */}
              <div className="space-y-4 border border-white/5 p-4 rounded-xl bg-white/[0.01]">
                <h4 className="text-xs font-bold text-indigo-400 font-mono uppercase tracking-wider">Right Promotion Card (Gradient Background)</h4>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Badge Text</label>
                    <input
                      type="text"
                      value={promo2.badge}
                      onChange={(e) => setPromo2({ ...promo2, badge: e.target.value })}
                      className={inputCls}
                      placeholder="e.g. Bundle & Save"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Card Title</label>
                    <input
                      type="text"
                      value={promo2.title}
                      onChange={(e) => setPromo2({ ...promo2, title: e.target.value })}
                      className={inputCls}
                      placeholder="e.g. Creator Starter Kits"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Card Description</label>
                    <textarea
                      value={promo2.desc}
                      onChange={(e) => setPromo2({ ...promo2, desc: e.target.value })}
                      className={`${inputCls} resize-none`}
                      rows={2}
                      placeholder="e.g. Save up to 25% when you bundle..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">CTA Button Text</label>
                    <input
                      type="text"
                      value={promo2.ctaText}
                      onChange={(e) => setPromo2({ ...promo2, ctaText: e.target.value })}
                      className={inputCls}
                      placeholder="e.g. Build Your Kit"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Target Category</label>
                    <input
                      type="text"
                      value={promo2.categoryTarget}
                      onChange={(e) => setPromo2({ ...promo2, categoryTarget: e.target.value })}
                      className={inputCls}
                      placeholder="e.g. All"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Gradient From Color</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={promo2.bgGradientFrom.startsWith('#') ? promo2.bgGradientFrom : '#9333ea'}
                          onChange={(e) => setPromo2({ ...promo2, bgGradientFrom: e.target.value })}
                          className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={promo2.bgGradientFrom}
                          onChange={(e) => setPromo2({ ...promo2, bgGradientFrom: e.target.value })}
                          className={inputCls}
                          placeholder="#9333ea"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Gradient To Color</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={promo2.bgGradientTo.startsWith('#') ? promo2.bgGradientTo : '#4f46e5'}
                          onChange={(e) => setPromo2({ ...promo2, bgGradientTo: e.target.value })}
                          className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={promo2.bgGradientTo}
                          onChange={(e) => setPromo2({ ...promo2, bgGradientTo: e.target.value })}
                          className={inputCls}
                          placeholder="#4f46e5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSavePromotions(promo1, promo2)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/10"
            >
              Update Dual Promotion Cards
            </button>
          </div>

          {/* Banner Settings Card */}
          <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-400 text-[18px]">view_carousel</span>
                Homepage Hero Banners
              </h3>
              {!isFormOpen && (
                <button
                  onClick={handleAddClick}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 shadow-md shadow-indigo-600/10"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  Add Banner
                </button>
              )}
            </div>

            {isFormOpen ? (
              <form onSubmit={handleFormSubmit} className="space-y-4 border-t border-white/5 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold text-indigo-400 font-mono uppercase tracking-wider">
                    {editingIndex !== null ? `Edit Banner #${editingIndex + 1}` : 'New Banner Details'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="text-slate-500 hover:text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Badge Text</label>
                    <input
                      type="text"
                      value={badgeText}
                      onChange={(e) => setBadgeText(e.target.value)}
                      className={inputCls}
                      placeholder="e.g. Hot Release"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Banner Headline</label>
                    <input
                      type="text"
                      value={bannerTitle}
                      onChange={(e) => setBannerTitle(e.target.value)}
                      className={inputCls}
                      placeholder="e.g. UPGRADE YOUR GEAR"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Sub-headline / Description</label>
                  <textarea
                    value={bannerSub}
                    onChange={(e) => setBannerSub(e.target.value)}
                    className={`${inputCls} resize-none`}
                    rows={2}
                    placeholder="e.g. Discover professional-grade tools for creators."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">CTA Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className={inputCls}
                    placeholder="e.g. Shop Now"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Banner Image</label>
                  <div className="flex gap-4 items-start">
                    <div className="w-24 aspect-video rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {bannerImage ? (
                        <img src={bannerImage} alt="Banner Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-slate-600">image</span>
                      )}
                    </div>
                    <div className="flex-1 flex gap-2">
                      <input
                        type="url"
                        value={bannerImage}
                        onChange={(e) => setBannerImage(e.target.value)}
                        className={inputCls}
                        placeholder="https://..."
                      />
                      <input
                        type="file"
                        ref={bannerInputRef}
                        onChange={handleBannerUpload}
                        className="hidden"
                        accept="image/*"
                      />
                      <button
                        type="button"
                        disabled={bannerUploading}
                        onClick={() => bannerInputRef.current?.click()}
                        className="px-4 py-2.5 bg-indigo-600/20 hover:bg-indigo-500/30 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                      >
                        {bannerUploading ? 'Uploading…' : 'Upload'}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/10"
                >
                  {editingIndex !== null ? 'Save Changes' : 'Add Banner to Carousel'}
                </button>
              </form>
            ) : (
              <div className="space-y-3 pt-2">
                {banners.length === 0 ? (
                  <div className="py-8 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-xl">
                    <span className="material-symbols-outlined text-slate-600 text-3xl">view_carousel</span>
                    <p className="text-slate-500 text-xs mt-2">No custom banners saved. Using storefront defaults.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                    {banners.map((b, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all group"
                      >
                        <div className="w-16 aspect-video rounded-lg overflow-hidden bg-slate-900 flex-shrink-0">
                          <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest font-mono">
                            {b.badge || 'Banner'}
                          </span>
                          <h4 className="text-xs font-bold text-white truncate">{b.title || 'Untitled Banner'}</h4>
                          <p className="text-[10px] text-slate-500 truncate">{b.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditClick(idx)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all"
                            title="Edit Banner"
                          >
                            <span className="material-symbols-outlined text-[14px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(idx)}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-lg transition-all"
                            title="Delete Banner"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
